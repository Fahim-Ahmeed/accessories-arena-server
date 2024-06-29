const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  model: String,
  brand: String,
  category: String,
  productType:String,
  description: String,
  price: Number,
  stockQuantity: Number,
  images: [String]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
