const SSLCommerzPayment = require('sslcommerz-lts');
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

const is_live = process.env.NODE_ENV === 'production'; // Determine if live based on environment
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

console.log("Environment Variables:");
console.log("BASE_URL:", BASE_URL);
console.log("CLIENT_URL:", CLIENT_URL);

router.post('/', async (req, res) => {
    const { userData, productData, totalPrice } = req.body;
    const { fullName, address, mobileNumber, email, district, city, area } = userData;
    const tran_id = uuidv4();

    const data = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${BASE_URL}/order/success/${tran_id}`,
        fail_url: `${BASE_URL}/order/fail/${tran_id}`,
        cancel_url: `${BASE_URL}/order/cancel`,
        ipn_url: `${BASE_URL}/order/ipn`,
        shipping_method: 'NO',
        product_name: 'Computer',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: fullName,
        cus_email: email,
        cus_add1: address,
        cus_city: city,
        cus_state: district,
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: mobileNumber,
        ship_name: fullName,
        ship_add1: address,
        ship_city: city,
        ship_state: district,
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
    };

    console.log("Payment Initialization Data:", data);

    try {
        const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASS, is_live);
        const apiResponse = await sslcz.init(data);
        let GatewayPageURL = apiResponse.GatewayPageURL;

        if (GatewayPageURL) {
            console.log("Gateway Page URL:", GatewayPageURL);

            // Save the order to the database
            const finalOrder = new Order({
                product: productData,
                ship_add: `${district}, ${city}, ${area}, ${address}`,
                email: email,
                paidStatus: false,
                number: mobileNumber,
                transactionId: tran_id
            });

            await finalOrder.save();

            // Send the payment URL to the client
            res.status(200).json({ url: GatewayPageURL });
        } else {
            console.error("Session was not successful:", apiResponse);
            res.status(400).json({ message: 'Session was not successful' });
        }
    } catch (error) {
        console.error('Error in payment initialization:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/success/:tranId', async (req, res) => {
    const tranId = req.params.tranId;
    console.log("Success Route, Transaction ID:", tranId);

    try {
        const order = await Order.findOneAndUpdate(
            { transactionId: tranId },
            { paidStatus: true },
            { new: true }
        );
        if (order) {
            res.redirect(`${CLIENT_URL}/payment/success/${tranId}`);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error in updating payment status:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/fail/:tranId', async (req, res) => {
    const tranId = req.params.tranId;
    console.log("Fail Route, Transaction ID:", tranId);

    try {
        const order = await Order.deleteOne({ transactionId: tranId });
        if (order) {
            res.redirect(`${CLIENT_URL}/payment/fail/${tranId}`);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error in deleting order:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
