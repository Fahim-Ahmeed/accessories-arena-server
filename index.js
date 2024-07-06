const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require("multer");
const bodyParser = require('body-parser');
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const Product = require('./models/Product');
const addressRoute=require('./routes/addressRoute')
const app = express();
const orderRoute=require("./routes/orderRoute")
const productRoutes=require("./routes/productRoutes")
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@accessoryarena.8ro87j2.mongodb.net/AccessoryArena?retryWrites=true&w=majority`;

// Mongoose connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Accessory Arena is running on port ${port}`);
  });
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
const upload = multer({ storage: storage });
app.use('/api', productRoutes);
app.use('/order',orderRoute);
app.use('/api/address', addressRoute);

app.get("/", (req, res) => {
  res.send("Accessory Arena is running");
});