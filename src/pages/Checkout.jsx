import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../App';
import { API_ENDPOINTS, getRequestHeaders, handleApiError } from '../config/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [submitError, setSubmitError] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [orderComplete, setOrderComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      // First save customer data
      const customerResponse = await fetch(API_ENDPOINTS.customer, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        })
      });

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json();
        throw new Error(errorData.message || 'Failed to save customer data');
      }

      // If customer data is saved successfully, process the order
      clearCart();
      setOrderComplete(true);
    } catch (error) {
      setSubmitError(error.message);
      handleApiError(error);
    }
  };

  if (orderComplete) {
    return (
      <div className="order-success">
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed. We will process it shortly.</p>
        <button onClick={() => navigate('/')} className="continue-shopping-btn">
          Return to Home
        </button>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/collection')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form-container">
        <h2>Checkout</h2>
        {submitError && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="form-section">
            <h3>Shipping Address</h3>
            <input
              type="text"
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Street Address"
              required
            />
            <div className="form-row">
              <input
                type="text"
                id="city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
              <input
                type="text"
                id="state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
            <input
              type="text"
              id="zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              placeholder="ZIP Code"
              required
            />
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              required
            />
            <div className="form-row">
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                required
              />
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order (₹{calculateTotal()})
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;