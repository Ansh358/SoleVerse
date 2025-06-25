const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Mock products data
const products = [
  {
    id: 1,
    name: 'Air Max Supreme',
    price: 15999
  },
  {
    id: 2,
    name: 'Ultra Boost X',
    price: 13999
  },
  {
    id: 3,
    name: 'Cloud Runner',
    price: 11999
  }
];

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Add this new endpoint
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

// PayPal API endpoints
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items data' });
    }

    // Calculate total from items
    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      return sum + (product.price * item.quantity);
    }, 0);

    if (total <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Mock PayPal order creation
    const order = {
      id: 'ORDER_' + Date.now(),
      status: 'CREATED',
      purchase_units: [{
        amount: {
          currency_code: 'INR',
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'INR',
              value: total.toFixed(2)
            }
          }
        },
        items: items.map(item => {
          const product = products.find(p => p.id === item.id);
          return {
            name: product.name,
            unit_amount: {
              currency_code: 'INR',
              value: product.price.toFixed(2)
            },
            quantity: item.quantity
          };
        })
      }]
    };

    res.json(order);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      error: 'Failed to create PayPal order',
      message: error.message
    });
  }
});

app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    // Here you would typically capture the PayPal order
    // This is a mock response
    res.json({
      id: orderID,
      status: 'COMPLETED',
      payer: {
        email_address: 'customer@example.com'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

