import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import cors from 'cors';
import { db, run } from "./db.js";
import fetch from 'node-fetch';


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
app.get('/api/gamelist/', async (req, res) => {
    const game = await db.collection('gamelist').find({}).toArray();
    if (game){
        res.json(game);
    } else {
        res.sendStatus(404);
    }
})

app.get('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const recipe = await db.collection('gamelist').findOne({ id });
    if (recipe){
        res.json(recipe);
    } else {
        res.sendStatus(404);
    }
})

app.post('/api/addgame/', async (req, res) => {
    const { name, console, img, condition, availability, notes } = req.body;
    let game = await db.collection('gamelist').insertOne({
        name, console, img, condition, availability, notes
    });
    let gameArray = await db.collection('gamelist').find({}).toArray();
    if (gameArray){
        res.json(gameArray);
    } else {
        res.sendStatus(404);
    }
})


run(()=>{
    app.listen(PORT, ()=>{
        console.log(`App is listening on port ` + PORT);
    });
}).catch(console.dir);