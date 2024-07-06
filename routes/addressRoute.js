const express = require('express');
const router = express.Router();
const Address = require('../models/address');
const is_live = false;

// @route   POST /api/address/add-address
// @desc    Create a new address
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/address
// @desc    Get all addresses
// @access  Public


router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const address = await Address.findOne({ email });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updatedAddress = await Address.findOneAndUpdate({ email }, req.body, { new: true, upsert: true });
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
