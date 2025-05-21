const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000; 
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@rjdvhav.mongodb.net/?retryWrites=true&w=majority&appName=hash`;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Declare collection variable globally
let gardenersCollection;

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('gardeningDB');

    gardenersCollection = db.collection('Featured gardeners'); 

    // Test ping
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

// Routes


app.get('/', (req, res) => {
  res.send('Users server is running');
});

app.get('/gardeners/active', async (req, res) => {
  try {
    const activeGardeners = await gardenersCollection
      .find({ status: 'active' })
      .limit(6)
      .toArray();

    res.json(activeGardeners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Users server is running on port ${port}`);
});
