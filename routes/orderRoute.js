const SSLCommerzPayment = require('sslcommerz-lts');
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const is_live = false;
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const tran_id = new ObjectId().toString();
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://accessories-arena-server.onrender.com' 
  : 'http://localhost:5000';
  console.log(baseURL)
router.post('/', async (req, res) => {
    const { userData, productData, totalPrice } = req.body;
    const { fullName, address, mobileNumber, email, district, city, area } = userData;
    const tran_id = uuidv4();
    const data = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${baseURL}/order/success/${tran_id}`,
        fail_url: `${baseURL}/order/fail/${tran_id}`,
        cancel_url: `${baseURL}/order/cancel`,
        ipn_url: `${baseURL}/order/ipn`,
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

    try {
        const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASS, is_live);
        const apiResponse = await sslcz.init(data);
        let GatewayPageURL = apiResponse.GatewayPageURL;

        if (GatewayPageURL) {
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

            // Redirect to the payment gateway
            res.status(200).json({ url: GatewayPageURL });
            console.log("Redirecting to:", GatewayPageURL);
        } else {
            res.status(400).json({ message: 'Session was not successful' });
        }
    } catch (error) {
        console.error('Error in payment initialization:', error);
        res.status(500).json({ message: error.message });
    }
});

// Success route
router.post('/success/:tranId', async (req, res) => {
    const tranId = req.params.tranId;
    try {
        const order = await Order.findOneAndUpdate(
            { transactionId: tranId },
            { paidStatus: true },
            { new: true }
        );
        if (order) {
            res.redirect(`http://localhost:5173/payment/success/${tranId}`);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error in updating payment status:', error);
        res.status(500).json({ message: error.message });
        
    }
});


//failedRoute
router.post('/fail/:tranId',async(req,res)=>{
    const tranId = req.params.tranId;
    const order = await Order .deleteOne({transactionId:tranId})

    try{

        if (order) {
            res.redirect(`http://localhost:5173/payment/fail/${tranId}`);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
   
})

module.exports = router;
