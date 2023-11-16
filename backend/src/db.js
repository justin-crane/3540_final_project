import {MongoClient} from "mongodb";
import 'dotenv/config';
let db;


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@atlascluster.axuhh7n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function listDatabases(client){
    let databasesList = await client.db().admin().listDatabases();
    console.log("Databases: ")
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

async function run(cb) {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await listDatabases(client);
    db = client.db("game-db");
    cb();
}

export {
    db,
    run
};
