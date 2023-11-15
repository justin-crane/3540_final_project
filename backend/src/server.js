import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import cors from 'cors';
import { db, run } from "./db.js";
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());


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
//commenting out for now as still working on
/* app.get('/api/gamelist/', authenticateToken, async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const games = await db.collection('gamelist').find({ userId }).toArray();
        if (games.length > 0){
            res.json(games);
        } else {
            res.status(404).send('No games found for this user');
        }
    } catch (error) {
        console.error('Error fetching user-specific games:', error);
        res.status(500).send('Error fetching games');
    }
}); */
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
    const recipe = await db.collection('gamelist').findOne({ id });
    if (recipe){
        res.json(recipe);
    } else {
        res.sendStatus(404);
    }
})

app.post('/api/addgame/', authenticateToken, async (req, res) => {
    const { name, gameConsole, img, condition, availability, notes } = req.body;

    // Extract the userId from request object, was attached by 'authenticateToken' middleware
    // Ensure the JWT token contains the user ID
    const userId = req.user.id;

    try {
        // Added userId
        const result = await db.collection('gamelist').insertOne({
            userId, name, gameConsole, img, condition, availability, notes
        });

        console.log(result); //added for debugging

        if (result.acknowledged === true) {
            res.status(201).json({ message: 'Game added successfully', insertedId: result.insertedId });
        } else {
            throw new Error('Insert operation did not return a valid result');
        }
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).send('Error adding game');
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


run(()=>{
    app.listen(PORT, ()=>{
        console.log(`App is listening on port ` + PORT);
    });
}).catch(console.dir);