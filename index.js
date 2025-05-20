const express = require('express');
const app = express();
require('dotenv').config();
const port=process.env.PORT ||3000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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

let tipsCollection;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const db = client.db('gardeningDB'); // apnar DB name
    tipsCollection = db.collection('tips'); // collection name
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);}

  
  
}
run().catch(console.dir);




//route
app.get('/',(req,res)=>{
    res.send(`users server is running`);
})

app.post('/tips',async(req,res)=>{
  try{
    const tip = req.body;
        const result = await tipsCollection.insertOne(tip);
    res.status(201).json({ message: 'Tip added successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
})


app.get('/tips', async (req, res) => {
  try {
    const tips = await tipsCollection.find({ availability: 'Public' }).toArray();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/mytips', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    const tips = await tipsCollection.find({ userEmail: email }).toArray();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/tips/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const tip = await tipsCollection.findOne({ _id: new ObjectId(id) });
    if (!tip) return res.status(404).json({ error: 'Tip not found' });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.put('/tips/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTip = req.body;
    const result = await tipsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedTip });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Tip not found' });
    res.json({ message: 'Tip updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tips/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await tipsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Tip not found' });
    res.json({ message: 'Tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Users server is running on port ${port}`);
});