const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require("multer");
const bodyParser = require('body-parser');
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const Product = require('./Product');
// const allowCors=require('./allowCors')

const app = express();
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

// Route for adding a new product with file upload
app.post("/api/computer-accessories", upload.array('images', 12), async (req, res) => {
  try {
    const { name, category, brand, productType, model, description, price, stockQuantity } = req.body;
    const images = req.files.map(file => file.path);

    const newProduct = {
      name,
      category,
      brand,
      productType,
      model,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      images
    };

    const result = await Product.create(newProduct);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Route for fetching a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Route for adding a new phone accessory with file upload
app.post("/api/phone-accessories", upload.array('images', 12), async (req, res) => {
  try {
    const { name, category, brand, productType, price, description, stockQuantity } = req.body;
    const images = req.files.map(file => file.path);

    const newProduct = {
      name,
      category,
      brand,
      productType,
      price: parseFloat(price),
      description,
      stockQuantity: parseInt(stockQuantity),
      images
    };

    const result = await Product.create(newProduct);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating phone accessory', error });
  }
});

// Route for adding a new gaming accessory with file upload
app.post("/api/gaming-accessories", upload.array('images', 12), async (req, res) => {
  try {
    const { name, category, brand, productType, price, description, stockQuantity } = req.body;
    const images = req.files.map(file => file.path);

    const newProduct = {
      name,
      category,
      brand,
      productType,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      images
    };

    const result = await Product.create(newProduct);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Route for adding a new phone item with file upload
app.post("/api/phones", upload.array('images', 12), async (req, res) => {
  try {
    const { name, brand, productType, model, price, description, stockQuantity } = req.body;
    const images = req.files.map(file => file.path);

    const newPhone = {
      name,
      brand,
      productType,
      model,
      price: parseFloat(price),
      description,
      stockQuantity: parseInt(stockQuantity),
      images
    };

    const result = await Product.create(newPhone);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating phone item', error });
  }
});

// Route for finding products by category
app.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error finding products by category", error });
  }
});

// Route for finding products by brand
app.get("/api/products/brand/:brand", async (req, res) => {
  try {
    const { brand } = req.params;
    const products = await Product.find({ brand });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error finding products by brand", error });
  }
});

// Route for updating a product
app.put('/api/products/:id', upload.array('images', 12), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure the _id field is not included in updateData
    if (updateData._id) {
      delete updateData._id;
    }

    if (req.files) {
      const images = req.files.map(file => file.path);
      updateData.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Route for deleting a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Route for fetching all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

app.get("/", (req, res) => {
  res.send("Accessory Arena is running");
});
