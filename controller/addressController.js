const Address = require('../models/addressModel');

const addAddress = async (req, res) => {
    try {
        const { fullName, address, mobileNumber,email, landmark, district, city, area } = req.body;

        const newAddress = new Address({
            fullName,
            address,
            mobileNumber,
            email,
            landmark,
            district,
            city,
            area
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addAddress, getAddresses };
