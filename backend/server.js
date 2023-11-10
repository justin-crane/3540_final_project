// server/index.js

const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://localhost:27017/VGTCDB';
const app = express();

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
