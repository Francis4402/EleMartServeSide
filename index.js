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
const featuredCollections = client.db('elemart').collection('featuredCollection');

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

app.get('/addproduct/:id', async (req, res) => {
    const id = req.params.id;
    const details = {_id: new ObjectId(id)}
    const result = await productCollection.findOne(details);
    res.send(result);
})

app.put('/addproduct/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true};
    const updateProducts = req.body;
    const products = {
        $set: {
            name: updateProducts.name,
            image: updateProducts.image,
            price: updateProducts.price,
            modelname: updateProducts.modelname,
            size: updateProducts.size,
            displaytype: updateProducts.displaytype,
            resolution: updateProducts.resolution,
            brightness: updateProducts.brightness,
            displayfeatures: updateProducts.displayfeatures,
            chipset: updateProducts.chipset,
            cputype: updateProducts.cputype,
            gpu: updateProducts.gpu,
            ram: updateProducts.ram,
            internalstorage: updateProducts.internalstorage,
            cardslot: updateProducts.cardslot,
            rcamresolution: updateProducts.rcamresolution,
            rcamfeatures: updateProducts.rcamfeatures,
            rvideorecording: updateProducts.rvideorecording,
            fcamresolution: updateProducts.fcamresolution,
            fcamfeatures: updateProducts.fcamfeatures,
            fcamvideorecording: updateProducts.fcamvideorecording,
            speaker: updateProducts.speaker,
            audiofeatures: updateProducts.audiofeatures,
            sim: updateProducts.sim,
            wifi: updateProducts.wifi,
            bluetooth: updateProducts.bluetooth,
            gps: updateProducts.gps,
            nfc: updateProducts.nfc,
            audiojack: updateProducts.audiojack,
            operatingsystem: updateProducts.operatingsystem,
            sensor: updateProducts.sensor,
            iprating: updateProducts.iprating,
            otherfeatures: updateProducts.otherfeatures,
            batterytype: updateProducts.batterytype,
            charging: updateProducts.charging,
            dimension: updateProducts.dimension,
            weight: updateProducts.weight,
            materials: updateProducts.materials,
            colors: updateProducts.colors,
            warranty: updateProducts.warranty,
            installationspolicy: updateProducts.installationspolicy,
            actype: updateProducts.actype,
            technology: updateProducts.technology,
            capacity: updateProducts.capacity,
            coverage: updateProducts.coverage,
            energysavingrating: updateProducts.energysavingrating,
            capacityofcooling: updateProducts.capacityofcooling,
            noiselevel: updateProducts.noiselevel,
            compressortype: updateProducts.compressortype,
            condenser: updateProducts.condenser,
            refrigeranttype: updateProducts.refrigeranttype,
            others: updateProducts.others,
            powertype: updateProducts.powertype,
            powerconsumption: updateProducts.powerconsumption,
            acweight: updateProducts.acweight,
            drivermagnet: updateProducts.drivermagnet,
            impedance: updateProducts.impedance,
            headphonesensitivity: updateProducts.headphonesensitivity,
            inputjack: updateProducts.inputjack,
            driverdiameter: updateProducts.driverdiameter,
            connectivity: updateProducts.connectivity,
            headphonesdimensions: updateProducts.headphonesdimensions,
            headphonesweight: updateProducts.headphonesweight,
            headphonescolor: updateProducts.headphonescolor,
            headphonescablelength: updateProducts.headphonescablelength,
            microphoneSize: updateProducts.microphoneSize,
            microphonesensitivity: updateProducts.microphonesensitivity,
            microphonepickup: updateProducts.microphonepickup,
            droneweight: updateProducts.droneweight,
            dronemaxspeed: updateProducts.dronemaxspeed,
            dronemaxflighttime: updateProducts.dronemaxflighttime,
            dronefov: updateProducts.dronefov,
            feature1: updateProducts.feature1,
            feature2: updateProducts.feature2,
            feature3: updateProducts.feature3,
            feature4: updateProducts.feature4,
            description1title: updateProducts.description1title,
            description2title: updateProducts.description2title,
            description3title: updateProducts.description3title,
            description4title: updateProducts.description4title,
            description5title: updateProducts.description5title,
            description6title: updateProducts.description6title,
            description7title: updateProducts.description7title,
            description1: updateProducts.description1,
            description2: updateProducts.description2,
            description3: updateProducts.description3,
            description4: updateProducts.description4,
            description5: updateProducts.description5,
            description6: updateProducts.description6,
            description7: updateProducts.description7,
            categories: updateProducts.categories,
            brands: updateProducts.brands,
        }
    }
    const result = await productCollection.updateOne(filter, products, options);
    res.send(result);
})

app.delete('/addproduct/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await productCollection.deleteOne(query);
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