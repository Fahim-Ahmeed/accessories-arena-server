// models/order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product: { type: Array, required: true },
    ship_add: { type: String, required: true },
    email: { type: String, required: true },
    paidStatus: { type: Boolean, required: true, default: false },
    number: { type: String, required: true },
    transactionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
