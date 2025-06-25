const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create new customer
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create new customer
    const customer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
      address
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
});

module.exports = router;