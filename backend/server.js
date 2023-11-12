// server/index.js

import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { MongoClient } from 'mongodb';

const PORT = process.env.PORT || 3001;

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@atlascluster.axuhh7n.mongodb.net/?retryWrites=true&w=majority`;
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

app.post('/api/addGame', upload.single('file'), async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
