const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// Mongodb Server 
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.x3bqwpe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection  
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");

        const questionsCollection = client.db("questions").collection("question");
        const userCollection = client.db("users").collection("user");


        // Create Api >>
        //http://localhost:5000/question
        app.post("/question", (req, res) => {
            const question = req?.body
            console.log(question)
            const result = questionsCollection.insertOne(question)
            res.send(result)
        })

        //http://localhost:5000/question
        app.get("/question", async (req, res) => {
            let totalPoint = 0
            let array = []
            const find = req?.params;
            const question = questionsCollection.find(find)
            const result = await question.toArray();
            const sortingResult = await result.sort((a, b) => (a.question_title > b.question_title) ? 1 : ((b.question_title > a.question_title) ? -1 : 0));

            await sortingResult.map(data => {
                totalPoint = parseInt(totalPoint) + parseInt(data?.point)
                let singleData = { ...data, totalPoint }
                array.push(singleData);
                console.log("hit", totalPoint);
            })
            console.log("hituuu", totalPoint);
            res.send(array)
        })

        //http://localhost:5000/question/delete/prams
        app.delete("/question/delete/:id", async (req, res) => {
            const id = req?.params?.id;
            const result = await questionsCollection.deleteOne({ "_id": ObjectId(id) });
            if (result.deletedCount === 1) {
                console.log("hit");
                res.send("Successfully deleted");
            }
        })

        //http://localhost:5000/userInfo/:email
        app.get("/userInfo/:email", async (req, res) => {
            const find = req?.params;
            const user = await userCollection.findOne(find)
            res.send(user)
        })

        //http://localhost:5000/userInfo-all
        app.get("/userInfo-all", async (req, res) => {
            const user = userCollection.find({ userType: "teacher", })
            const result = await user.toArray()
            res.send(result)
        })

        //http://localhost:5000/userInfo/:email
        app.put("/userInfo/:email", async (req, res) => {
            const result = req?.body
            const email = req?.params?.email;
            const userType = req?.query;
            console.log(userType);
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: email, result
                },
            };
            const updateResult = await userCollection.updateOne(filter, updateDoc, options);
            res.send(updateResult)
        })

        //http://localhost:5000/userInfo/:email
        app.put("/login/:email", async (req, res) => {
            const userType = req?.body
            const email = req?.params?.email;
            console.log(userType);
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: email, userType: userType?.userType
                },
            };
            const updateResult = await userCollection.updateOne(filter, updateDoc, options);
            res.send(updateResult)
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

//Root Get api
app.get('/', (req, res) => {
    res.send("Super-Assistant Server is Runnin...")
})

app.listen(port, () => {
    console.log('listen to port, ', port);
})

run().catch(console.dir)
//user_name: super-assistant
//user_password: admin321