const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const {decode} = require('jsonwebtoken')
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_Pass}@cluster0.cefd8nv.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbConnect = async () => {
    try{
        await client.connect()
        console.log('DB Connected Successfully')
    } catch (error){
        console.log(error.name, error.message)
    }
}
dbConnect()

const logger = async (req, res, next) => {
    next();
}

const productCollection = client.db('elemart').collection('product');
const userCollection = client.db('elemart').collection('users');
const cartCollections = client.db('elemart').collection('cart');

app.get('/', (req, res) => {
    res.send('server started')
})

app.post('/jwt', logger, async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCRESS_TOKEN_SECRET, {expiresIn: '1h'});
    res.send({token});
})

const verifyToken = async (req, res, next) => {
    // console.log('inside verify token', req.headers.authorization)
    if(!req.headers.authorization){
        return res.status(401).send({message: 'forbidden access'});
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCRESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}

app.get('/product', async (req, res) => {
    const result = await productCollection.find().toArray();
    res.send(result);
})

app.get('/product/:name/:id', async (req, res) => {
    const id = req.params.id;
    const details = {_id: new ObjectId(id)}
    const result = await productCollection.findOne(details);
    res.send(result);
})

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const getPost = {_id: new ObjectId(id)}
    const result = await productCollection.find(getPost);
    res.send(result);
})

app.post('/addproduct', async (req, res) => {
    const post = req.body;
    const result = await productCollection.insertOne(post);
    res.send(result);
})


app.get('/users', async (req, res) => {
    const email = req.query.email;
    const query = {email: email}
    const result = await userCollection.find(query).toArray();
    res.send(result);
})

app.post('/users', async (req, res) => {
    const users = req.body;
    const query = {email: users.email}
    const existingUser = await userCollection.findOne(query);
    if(existingUser){
        return res.send({message: 'user already exists', insertedId: null})
    }
    const result = await userCollection.insertOne(users);
    res.send(result);
})

app.get('/cart', async (req, res) => {
    const email = req.query.email;
    const query = {email: email};
    const result = await cartCollections.find(query).toArray();
    res.send(result);
})

app.post('/cart', async (req, res) => {
    const cart = req.body;
    const result = await cartCollections.insertOne(cart);
    res.send(result);
})

app.delete('/users/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);
})

app.listen(port, () => {
    console.log(`server started, ${port}`)
})