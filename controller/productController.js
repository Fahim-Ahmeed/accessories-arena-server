const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
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
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};
