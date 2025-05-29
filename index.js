const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@rjdvhav.mongodb.net/?retryWrites=true&w=majority&appName=hash`;

// MongoClient config
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let tipsCollection;
let gardenersCollection;
let trendingTipsCollection;

async function run() {
  try {
    const gardeningdb = client.db('gardeningDB');

    gardenersCollection = gardeningdb.collection('FeaturedGardeners');
    trendingTipsCollection = gardeningdb.collection('TrendingTips');
    tipsCollection = gardeningdb.collection('Tips');

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('🌿 Gardening community server is running');
});

app.get('/gardeners/active', async (req, res) => {
  try {
    const activeGardeners = await gardenersCollection
      .find({ status: 'active' })
      .limit(6)
      .toArray();

    res.json(activeGardeners);
  } catch (error) {
    console.error("Error in /gardeners/active:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/trending/tips', async (req, res) => {
  try {
    const trendingTips = await trendingTipsCollection
      .find({ istrending: true })
      .limit(6)
      .toArray();

    res.json(trendingTips);
  } catch (error) {
    console.error("Error in /tips/trending:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/garden-tips', async (req, res) => {
  try {
    const tip = req.body;

    if (tip.totalLiked === undefined) {
      tip.totalLiked = 0;
    }

    const result = await tipsCollection.insertOne(tip);
    res.status(201).json({ message: 'Tip saved successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error saving tip:', error);
    res.status(500).json({ message: 'Failed to save tip', error: error.message });
  }
});


app.get('/api/garden-tips', async (req, res) => {
  try {
    const tips = await tipsCollection.find({}).toArray();
    res.json(tips);
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ message: 'Failed to fetch tips' });
  }
});


app.get('/api/garden-tips/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tip ID' });
    }

    const tip = await tipsCollection.findOne({ _id: new ObjectId(id) });
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    res.json(tip);
  } catch (error) {
    console.error('Error fetching tip details:', error);
    res.status(500).json({ message: 'Failed to fetch tip details' });
  }
});

app.patch('/api/garden-tips/:id/like', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tip ID' });
    }

    const result = await tipsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { totalLiked: 1 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    res.json({ message: 'Like updated successfully' });
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
});

app.put('/api/garden-tips/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tip ID' });
    }

    const {
      title,
      plantType,
      difficultyLevel,
      description,
      imagesUrl,
      isPublic,
    } = req.body;


    const result = await tipsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          plantType,
          difficultyLevel,
          description,
          imagesUrl,
          isPublic,
          
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    res.json({ message: 'Tip updated successfully' });
  } catch (error) {
    console.error('Error updating tip:', error);
    res.status(500).json({ message: 'Failed to update tip' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
