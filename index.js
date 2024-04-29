const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.SERVER_PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true 
  
}));


app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r31xce1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {


        const userCollections = client.db("a10UserDB").collection('newUser');
        const spotCollections = client.db("spotsDB").collection('newSpot');
        const countryCollections = client.db("countryDB").collection('newCountry');
        const guideCollections = client.db("guideDB").collection('newGuide');
        const clientCollections = client.db("clientDB").collection('newClient');

        //  add user 
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollections.insertOne(newUser);
            res.send(result)
        });


        // get multiple data
        app.get('/user', async(req, res) => {
            const cursor = userCollections.find();
            const result =  await cursor.toArray()
            res.send(result)
        })

        // update login user datat
        app.patch('/user',async(req,res)=>{
            const email=  req.body.email
            const name=  req.body.name
           
            
              const filter = { email: email };
              const updateDoc = {
                $set: {
                    name:name,
                  email:email,
                  
                },
              };
              const result = await userCollections.updateOne(filter, updateDoc);
              res.send(result)
            })
            


// ------------------------- Spot related Api-----------

 //  add user 
 app.post('/spot', async (req, res) => {
    const newSpot = req.body;
    const result = await spotCollections.insertOne(newSpot);
    res.send(result)
});

app.get('/spot', async(req, res) => {
    const cursor = spotCollections.find();
    const result =  await cursor.toArray()
    res.send(result)
})


// data sort low to high 
app.get('/spotLow', async(req, res) => {
    const options = {
        sort: { average_cost: -1 },
    };
    const cursor = spotCollections.find({},options);
 
    
    const result =  await cursor.toArray();
    res.send(result);

});



// data sort high to low 
app.get('/spotUp', async(req, res) => {
    const options = {
        sort: { average_cost: 1 },
    };
    // const cursor = spotCollections.find({},options);
    const cursor = spotCollections.find().sort({average_cost: 1})
    const result =  await cursor.toArray();
    res.send(result);
});

// get single data 
        app.get('/spot/:id', async(req, res) => {
            const id= req.params.id
             const query = { _id: new ObjectId(id) };
             const result = await spotCollections.findOne(query);
            res.send(result)
        })

// get single data using emsil

app.post('/spot/myData', async(req, res) => {
        const email= req.body
         const query = {user_email:email.email};
         
         const cursor = spotCollections.find(query);
         const result =  await cursor.toArray()
        //  res.send(result)

         res.json(result);
        console.log(email);
    })


     // delete data

        app.delete('/spot/:id', async(req, res) => {
           const id= req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await spotCollections.deleteOne(query);
            res.send(result)
        })
 

        // update spot 

         app.patch('/spot/:id', async(req, res) => {
            const data = req.body
            const id= req.params.id
            console.log(data);
            const filter  = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    user_name: data.user_name,
                    user_email: data.user_email,
                    spot_name: data.spot_name,
                    country_name: data.country_name,
                    imageURL: data.imageURL,
                    location: data.location,
                    average_cost: data.average_cost,
                    seasonality: data.seasonality,
                    travel_time: data.travel_time,
                    totalVisitors: data.totalVisitors,
                    description: data.description,
                  
                },
              };
              const result = await spotCollections.updateOne(filter, updateDoc);
             res.send(result)
         })



         // ------------------------- Countries  related Api-----------

        //  add data
         app.post('/country', async (req, res) => {
            const newCounry = req.body;
            const result = await countryCollections.insertOne(newCounry);
            res.send(result)
        });


// get multiple data 

app.get('/country', async(req, res) => {
    const cursor = countryCollections.find();
    const result =  await cursor.toArray()
    res.send(result)
})

// get single data 
app.get('/country/:country', async(req, res) => {
    const country= req.params.country
    
    
     const query = { country_name: country };
     const cursor = spotCollections.find(query);
         const result =  await cursor.toArray()
    res.send(result)
})

// ================guide Api========
app.post('/guide', async (req, res) => {
    const newGuide = req.body;
    const result = await guideCollections.insertOne(newGuide);
    res.send(result)
});

// get multiple data 

app.get('/guide', async(req, res) => {
    const cursor = guideCollections.find();
    const result =  await cursor.toArray()
    res.send(result)
})



// ============Client API===========
app.post('/client', async (req, res) => {
    const newClient = req.body;
    const result = await clientCollections.insertOne(newClient);
    res.send(result)
});
app.get('/client', async(req, res) => {
    const cursor = clientCollections.find();
    const result =  await cursor.toArray()
    res.send(result)
})


        

        console.log("Pinged your deployment. You successfully connected to MongoDB! m");
    } finally {

        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})