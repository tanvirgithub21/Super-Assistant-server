const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// Mongodb Server 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://super-assistant:admin321@cluster0.x3bqwpe.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection  
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");

        const questionsCollection = client.db("questions").collection("question");


        // Create Api >>

        //http://localhost:5000/question
        app.post("/question", (req, res) => {
            const question = req?.body
            const result = questionsCollection.insertOne(question)
            res.send(result)
        })














    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir)



//Root Get api
app.get('/', (req, res) => {
    res.send("Super-Assistant Server is Runnin...")
})

app.listen(port, () => {
    console.log('listen to port, ', port);
})

//user_name: super-assistant
//user_password: admin321