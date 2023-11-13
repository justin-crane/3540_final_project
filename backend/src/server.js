import 'dotenv/config';
import { db, run } from "./db.js";
import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();

/*

    Tester API

 */

app.use(express.json());
app.get('/api/hello/', async (req, res) => {
    res.send("Hello");
})


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