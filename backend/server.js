// server/index.js

import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { MongoClient } from 'mongodb';

import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import cors from 'cors';

// Google OAuth Client setup
const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/api/google/oauth' // Make sure this matches the redirect URI set in Google Cloud
);

// Generate Google OAuth URL
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

const PORT = process.env.PORT || 3001;

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@atlascluster.axuhh7n.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
app.use(cors());

app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

// Route to get Google OAuth URL
app.get('/api/google/oauthURL', (req, res) => {
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

        // Can create or update the user in database, then create a JWT token for user
        const token = jwt.sign({ email: profile.email, name: profile.name }, process.env.JWT_SECRET, { expiresIn: '2d' });

        // Redirect user to frontend with JWT
        res.redirect(`http://localhost:3000?token=${token}`);
    } catch (error) {
        console.error('Error during Google OAuth:', error);
        res.status(500).json({ message: 'Error during Google OAuth' });
    }
});

app.post('/api/addGame', authenticateToken, upload.single('file'), async (req, res) => {
    const client = new MongoClient(MONGO_URI)
    await client.connect();
    const db = client.db("game-db")
    await db.collection("gamelist").insertOne({
        "name":req.body.name,
        "console":req.body.console,
        "img":req.body.img,
        "condition":req.body.condition,
        "availability":req.body.availability,
        "notes":req.body.notes
    });
    await db.collection("gamelist").find({}).toArray();
})

app.post('/api/login', async (req, res) => {
    // Find user in database, and checkpassword.
    const user = { id: 1, username: 'exampleUser' };

    // Generate token
    jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            return res.status(500).json({ message: 'Error generating token' });
        }
        res.json({ token });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
