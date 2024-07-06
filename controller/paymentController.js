const sslcommerzService = require('../services/sslcommerzService');

exports.initiatePayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const response = await sslcommerzService.initPayment(paymentData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error initiating payment', error });
  }
};

// Add more controller functions as needed
