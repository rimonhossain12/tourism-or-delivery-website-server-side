const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { response } = require('express');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { signal } = require('nodemon/lib/config/defaults');
const { reset } = require('nodemon');


const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygqbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelSite');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('userOrder');


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // get single service
        app.get('/single/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await servicesCollection.findOne(query);
            res.json(singleService);
        });
        // find date using email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = ordersCollection.find({ email });
            const products = await cursor.toArray();
            res.send(products);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });
        // user order post api
        app.post('/userOrder', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await ordersCollection.insertOne(data);
            res.json(result);
        });

        // delete user order
        app.delete('/cancel/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            console.log('data is deleted',result);
            res.json(result);
            
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travel node js server')
})

app.listen(port, () => {
    console.log('Running travel server on port', port);
})