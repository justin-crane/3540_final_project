import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import cors from 'cors';
import { db, run } from "./db.js";
import express from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { ObjectId } from 'mongodb';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';
import axios from "axios";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const messageServerPort = 3002;

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        //console.log(data);
        socket.to(data.room).emit("receive_message", data)
    });
});

server.listen(messageServerPort, () => {
    console.log("Server is running");
});


const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: region,
});

const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, Object.assign({}, req.body));
        },
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})
const singleUpload = upload.single('img');


/*

    Tester API
    
 */

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/hello/', async (req, res) => {
    res.send("Hello");
})


/*

    OAuth
    
 */
// Set up Google OAuth client
const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://54.210.56.142:3000/api/google/oauth' // Redirect URI set in Google Cloud
);

// Generate Google OAuth URL function
const getGoogleOauthURL = () => {
    return oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    });
};
const googleOauthURL = getGoogleOauthURL();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); //debugging
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Google OAuth URL route
app.get('/api/google/oauthURL', (req, res) => {
    const googleOauthURL = getGoogleOauthURL();
    res.status(200).json({ "url": googleOauthURL });
});

// Google OAuth callback route
app.get('/api/google/oauth', async (req, res) => {
    try {
        const { code } = req.query;
        console.log("Authorization code:", code); // Log the authorization code

        const { tokens } = await oauthClient.getToken(code);
        console.log("Tokens received:", tokens); // Log the received tokens

        const accessToken = tokens.access_token;
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);
        const profile = await response.json();

        // Check if user exists, if not, create a new one
        let user = await db.collection('users').findOne({ email: profile.email });
        if (!user) {
            let result = await db.collection('users').insertOne({
                email: profile.email,
                username: profile.name,
            });
            user = { _id: result.insertedId, email: profile.email, username: profile.name };
        }

        // Generate JWT token with user ID
        const token = jwt.sign({ id: user._id, email: profile.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2d' });
        // Redirect to frontend with JWT
        console.log(token);
        res.redirect(`/?token=${token}`);
    } catch (error) {
        console.error('Error during Google OAuth:', error);
        console.log("Error details:", error.message); // More detailed error logging
        res.status(500).json({ message: 'Error during Google OAuth' });
    }
});


/*

   Messenger API
   
 */
app.get('/api/message/:sender/:recipient', async (req, res) => {
    const { sender, recipient } = req.params;
    try {
        let query = { $in:[sender, recipient]};
        const messages = await db.collection('messages').findOne({
            userA: query, userB: query
        });
        if (messages){
            const chatLookup = { _id: new ObjectId(messages._id) };
            let updatedLog;
            const options = { upsert: true };
            if (sender === messages.userA){
                updatedLog = {
                    $set: {
                        userANotif: false,
                    }
                }
            } else {
                updatedLog = {
                    $set: {
                        userBNotif: false,
                    }
                }
            }

            let messageArray = await db.collection('messages').findOneAndUpdate(chatLookup, updatedLog, options);
            res.json(messages);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages');
    }
});

app.post('/api/message/', async (req, res) => {
    const { sender, recipient, messageBody } = req.body;
    let query = { $in: [sender, recipient]};
    let messageLog = {
        _id: "",
        userA: "",
        userB: "",
        chatLog: "",
        userANotif: false,
        userBNotif: false
    }
    let updatedLog;

    messageLog = await db.collection('messages').findOne({
        userA: query, userB: query
    });

    if (messageLog){
        const chatLookup = { _id: new ObjectId(messageLog._id) };
        const options = { upsert: true };
        messageLog.chatLog.push({sender: sender, message: messageBody, timeStamp: new Date().getTime()})
        //console.log(messageLog)

        if (sender === messageLog.userA){
            updatedLog = {
                $set: {
                    chatLog: messageLog.chatLog,
                    userANotif: false,
                    userBNotif: true,
                }
            }
        } else {
            updatedLog = {
                $set: {
                    chatLog: messageLog.chatLog,
                    userANotif: true,
                    userBNotif: false,
                }
            }
        }

        let messageArray = await db.collection('messages').findOneAndUpdate(chatLookup, updatedLog, options);
        res.json(messageArray);
    } else {
        const newMessage = {
            userA: sender,
            userB: recipient,
            chatLog: [{sender: sender, message: messageBody, timeStamp: new Date().getTime()}]
        }
        let newMessageLog = await db.collection('messages').insertOne(newMessage);
        res.json(newMessageLog);
    }
})

app.get('/api/messages/:username', async (req, res) => {
    const { username } = req.params;
    let userMessagesA = await db.collection('messages').find({
        userB: username
    }).toArray();
    let userMessagesB = await db.collection('messages').find({
        userA: username
    }).toArray();

    const userMessages = userMessagesA.concat(userMessagesB);
    res.json(userMessages);
})
/*

    Game Collection API

 */
app.get('/api/gamelist/', async (req, res) => {
    try {
        const games = await db.collection('gamelist').find({}).toArray();
        if (games){
            res.json(games);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send('Error fetching games');
    }
});

app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const game = await db.collection('gamelist').findOne({ id });
    if (game){
        res.json(game);
    } else {
        res.sendStatus(404);
    }
})

app.get('/api/randomgame/', async (req, res) => {
    try {
        const randomGame = await db.collection('gamelist').aggregate([{$sample: {size: 1}}]).toArray();
        if (randomGame){
            res.json(randomGame);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error fetching random game:', error);
        res.status(500).send('Error fetching random game');
    }
});

app.get('/api/search/:searcheditem', async (req, res) => {
    const { searcheditem } = req.params;
    try {
        const searchedGames = await db.collection('gamelist').find({$text: {$search: searcheditem}}).toArray();
        if (searchedGames){
            res.json(searchedGames);
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        console.error('Error searching for game:', error);
        res.status(500).send('Error searching for game');
    }
});

app.put('/api/games/:id/update', async (req, res) => {
    const gameLookup = { _id: new ObjectId(req.params.id) };
    const newGameInfo = {
        $set: {
            "name": req.body.name,
            "gameConsole": req.body.gameConsole,
            "condition": req.body.condition,
            "forTrade": req.body.forTrade,
            "forSale": req.body.forSale,
            "price": req.body.price,
            "userInfo": {
                "username": req.body.username,
                "userID": req.body.userID,
            },
            "dateAdded": req.body.dateAdded,
            "notes": req.body.notes,
            "img": req.body.img
        }
    };
    const options = { upsert: true };
    const game = await db.collection('gamelist').findOne(gameLookup);
    const gameUpdated = await db.collection('gamelist').findOneAndUpdate(gameLookup, newGameInfo, options);
    if (game){
        res.json(gameUpdated);
    } else {
        res.sendStatus(404);
    }
})

app.delete('/api/games/:id/remove', async (req, res) => {
    const gameLookup = { _id: new ObjectId(req.params.id) };
    const removedGame = await db.collection("gamelist").deleteOne( gameLookup );
    console.log(removedGame);
    const data = await db.collection("gamelist").find({}).toArray();
    res.json(data);
});

app.post('/api/addGameImage/', async (req, res) => {
    singleUpload(req, res, function(err, some) {
        if (err) {
            return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
        }
        return res.json({'imageLocation': req.file.location});
    })
});
/* We have two addgames so i commented one out
app.post('/api/addgame/', async (req, res) => {

    let { name, gameConsole, img, condition, price,
        forTrade, forSale, userInfo, username, userID, dateAdded, notes } = req.body;

    userInfo = {
        "username": username,
        "userID": userID
    }

    let game = await db.collection('gamelist').insertOne({
        name, gameConsole, img, condition, forTrade, forSale,
        userInfo, price, dateAdded, notes
    });
    let gameArray = await db.collection('gamelist').find({}).toArray();
    if (gameArray){
        res.json(gameArray);

    } else {
        res.sendStatus(404);
    }
});
*/

// User can add game to their profile
app.post('/api/addgame/', authenticateToken, async (req, res) => {
    const { name, gameConsole, img, condition, price, forTrade, forSale, dateAdded, notes } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    // Convert forTrade and forSale from string to boolean
    const forTradeBool = typeof forTrade === 'string' ? forTrade === 'true' : forTrade;
    const forSaleBool = typeof forSale === 'string' ? forSale === 'true' : forSale;

    try {
        const result = await db.collection('gamelist').insertOne({
            name,
            gameConsole,
            img,
            condition,
            forTrade: forTradeBool,
            forSale: forSaleBool,
            userInfo: { username, userID: userId },
            price,
            dateAdded,
            notes
        });
        res.status(201).json({message: 'Game added successfully'});
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).send('Error adding game');
    }
});
// User can delete game from their profile
app.delete('/api/deletegame/:id', authenticateToken, async (req, res) => {
    const gameId = req.params.id;
    const userId = req.user.id; // Extracted from the JWT token

    try {
        const result = await db.collection('gamelist').deleteOne({_id: new ObjectId(gameId), 'userInfo.userID': userId});
        if (result.deletedCount === 0) {
            return res.status(404).send('No game found with this id for the user');
        }
        res.status(200).send('Game deleted successfully');
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).send('Error deleting game');
    }
});

// User can modify a game on their profile
app.put('/api/modifygame/:id', authenticateToken, async (req, res) => {
    const gameId = req.params.id;
    const userId = req.user.id;
    let updateData = req.body;

    // Remove _id from update data
    delete updateData._id;

    // Convert forTrade and forSale from string to boolean, similar to addgame
    if (typeof updateData.forTrade === 'string') {
        updateData.forTrade = updateData.forTrade === 'true';
    }
    if (typeof updateData.forSale === 'string') {
        updateData.forSale = updateData.forSale === 'true';
    }

    try {
        const result = await db.collection('gamelist').updateOne(
            { _id: new ObjectId(gameId), 'userInfo.userID': userId },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send('No game found with this id for the user');
        }
        res.status(200).send('Game updated successfully');
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).send('Error updating game');
    }
});

// User registration route
app.post('/api/register', async (req, res) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    const existingUser = await db.collection('users').findOne({email: email});
    if (existingUser) {
        return res.status(409).send('Email already in use');

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await db.collection('users').insertOne({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: result.insertedId,
            email: email
        }, process.env.JWT_SECRET, {expiresIn: '2d'});

        res.status(201).send({id: result.insertedId, token: token});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await db.collection('users').findOne({email: email});
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({id: user._id, email: email}, process.env.JWT_SECRET, {expiresIn: '2d'});
            res.status(200).send({token: token});
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
});

// Fetch games for the authenticated user
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const games = await db.collection('gamelist').find({ 'userInfo.userID': userId }).toArray();
        res.json(games);
    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).send('Error fetching user games');
    }
});

app.get('/api/user/:userid', async (req, res) => {
    try {
        const userId = req.params;
        console.log("user: " + userId.userid);
        const games = await db.collection('gamelist').find({ 'userInfo.userID': userId.userid }).toArray();
        res.json(games);
    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).send('Error fetching user games');
    }
});
/*

    PriceCharting API Integration

 */
const PRICE_API_KEY = process.env.PRICE_API_KEY;
app.post('/api/price/:gameName/:consoleName', async (req, res) => {
    const {gameName, consoleName} = req.params;

    const gameRes = await axios.get(
        `https://www.pricecharting.com/api/products?t=${PRICE_API_KEY}&q=${gameName}`)

    const gameReturn = gameRes.data['products'].find((game) =>
        game['console-name'] === consoleName
    )

    res.json(gameReturn);
})


run(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on port ` + PORT);
    });
}).catch(console.dir);