import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import cors from 'cors';
import { db, run } from "./db.js";

import express from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import {ObjectId} from 'mongodb';

import fetch from 'node-fetch';
import bcrypt from 'bcrypt';


const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());


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
    'http://localhost:3001/api/google/oauth' // Redirect URI set in Google Cloud
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
        const { tokens } = await oauthClient.getToken(code);

        const accessToken = tokens.access_token;
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);
        const profile = await response.json();

        // Create or update user in database, create JWT token
        const token = jwt.sign({ email: profile.email, name: profile.name }, process.env.JWT_SECRET, { expiresIn: '2d' });

        // Redirect to frontend with JWT
        res.redirect(`http://localhost:3000?token=${token}`);
    } catch (error) {
        console.error('Error during Google OAuth:', error);
        res.status(500).json({ message: 'Error during Google OAuth' });
    }
});


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

app.put('/api/games/:id/update', async (req, res) => {
    const gameLookup = { _id: new ObjectId(req.params.id) };
    const newGameInfo = {
        $set: {
            "name": req.body.name,
            "console": req.body.console,
            "condition": req.body.condition,
            "availability": req.body.availability,
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
})

app.post('/api/addgame/', async (req, res) => {

    const { name, console, img, condition, price,
        forTrade, forSale, userInfo, username, userID, dateAdded, notes } = req.body;

    let game = await db.collection('gamelist').insertOne({
        name, console, img, condition, forTrade, forSale,
        userInfo, username, userID, dateAdded, notes });
    let gameArray = await db.collection('gamelist').find({}).toArray();
    if (gameArray){
        res.json(gameArray);

    } else {
        res.sendStatus(404);
    }
});

// User can add game to their profile
app.post('/api/addgame/', authenticateToken, async (req, res) => {
    const { name, gameConsole, img, condition, availability, notes } = req.body;
    const userId = req.user.id; // Extracted from the JWT token

    try {
        const result = await db.collection('gamelist').insertOne({
            userId, // Associates the game with a user
            name, gameConsole, img, condition, availability, notes
        });
        res.status(201).json({ message: 'Game added successfully' });
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
        const result = await db.collection('gamelist').deleteOne({ _id: new ObjectId(gameId), userId });
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
    const userId = req.user.id; // Extracted from the JWT token
    const updateData = req.body; // Data to update

    try {
        const result = await db.collection('gamelist').updateOne({ _id: new ObjectId(gameId), userId }, { $set: updateData });
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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    const existingUser = await db.collection('users').findOne({ email: email });
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

        const token = jwt.sign({ id: result.insertedId, email: email }, process.env.JWT_SECRET, { expiresIn: '2d' });

        res.status(201).send({ id: result.insertedId, token: token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await db.collection('users').findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET, { expiresIn: '2d' });
            res.status(200).send({ token: token });
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
});

// Fetch games for the authenticated user
app.get('/api/usergames', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the JWT token includes user's ID
        const games = await db.collection('gamelist').find({ userId }).toArray();
        res.json(games);
    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).send('Error fetching user games');
    }
});

app.get('/api/usergames/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const games = await db.collection('gamelist').find({ userId }).toArray();
        res.json(games);
    } catch (error) {
        console.error('Error fetching user games:', error);
        res.status(500).send('Error fetching user games');
    }
});


run(()=>{
    app.listen(PORT, ()=>{
        console.log(`App is listening on port ` + PORT);
    });
}).catch(console.dir);