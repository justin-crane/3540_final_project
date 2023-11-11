// server/index.js

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const mongo = require("mongodb")
const {MongoClient} = require("mongodb");
require('dotenv').config()

const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb+srv://' + process.env.USER + ':'+ process.env.PASSWORD +'@atlascluster.axuhh7n.mongodb.net/';
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({storage: storage});

// Connect to MongoDB
/*mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const db = mongoose.connection;*/

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
