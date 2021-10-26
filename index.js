const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0i8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting the api ', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        }
        )
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running genius server')
})
app.get('/hello', (req, res) => {
    res.send('hello updated here')
})
app.listen(port, () => {
    console.log('running Genius server', port);
})

/*
one time
1.heroku account open
2.heroku software install
3
every project
1.git init
2.gitignore(nodemodules,.env)
3 .push everything to git
4.make sure you have this script "start":"node index.js"
5.make sure put process.env.PORT in front of your port number
6.heroku login
7.heroku create(only one time for project)
8 command : git push heroku main

------
update
1.save everything check locally
2.git add, git commit ,git push
3.git push heroku main
*/