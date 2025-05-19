const express =require('express');
const app = express();
require('dotenv').config();
const port=process.env.PORT ||3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());



//pass:c0lLfKaaA0dRJc4P
//user:bananaDBUser




const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@.rjdvhav.mongodb.net/?retryWrites=true&w=majority&appName=hash`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
   
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send(`users server is running`);
})

app.listen(port,()=>{
    console.log(`Users server is running on port ${port}`);
})