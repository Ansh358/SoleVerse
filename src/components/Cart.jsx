import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { ShopContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_ENDPOINTS, getRequestHeaders, handleApiError } from '../config/api';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(ShopContext);
  const [paymentError, setPaymentError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(true);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setIsLoading(false);
      setImagesLoaded(true);
      return;
    }

    const loadImages = async () => {
      try {
        const imagePromises = cartItems.map(item =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = item.image;
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load image for ${item.name}`));
          })
        );
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (err) {
        console.error('Failed to load cart images:', err);
        setPaymentError('Failed to load some product images. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [cartItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaypalLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!imagesLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product images...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <Link to="/collection" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="item-details">
            <h3>{item.name}</h3>
            <p className="price">${item.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button
                className="quantity-btn minus"
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                aria-label="Decrease quantity"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  updateQuantity(item.id, Math.max(0, value));
                }}
                min="0"
                aria-label="Item quantity"
              />
              <button
                className="quantity-btn plus"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
          <button 
            className="remove-btn" 
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove item"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        
        {paymentError && (
          <div className="error-message">{paymentError}</div>
        )}

        <div className="payment-options">
          {paypalLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading payment options...</p>
            </div>
          ) : (
            <>
              <PayPalButtons
                className="paypal-button-container"
                createOrder={async () => {
                  try {
                    const response = await fetch(API_ENDPOINTS.createPaypalOrder, {
                      method: 'POST',
                      headers: getRequestHeaders(),
                      body: JSON.stringify({
                        items: cartItems.map(item => ({
                          id: item.id,
                          quantity: item.quantity
                        }))
                      }),
                    });

                    const order = await response.json();
                    return order.id;
                  } catch (error) {
                    setPaymentError('Error creating PayPal order');
                    handleApiError(error);
                    throw error;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    const response = await fetch(API_ENDPOINTS.capturePaypalOrder, {
                      method: 'POST',
                      headers: getRequestHeaders(),
                      body: JSON.stringify({
                        orderID: data.orderID
                      }),
                    });

                    const orderData = await response.json();
                    if (orderData.status === 'COMPLETED') {
                      // Clear cart and show success message
                      alert('Payment successful!');
                      // You can add more sophisticated success handling here
                    }
                  } catch (error) {
                    setPaymentError('Error processing payment');
                    handleApiError(error);
                  }
                }}
                onError={(error) => {
                  setPaymentError('PayPal payment failed');
                  handleApiError(error);
                }}
              />
              <div className="divider">or</div>
              <Link to="/checkout" className="checkout-btn">
                Proceed to Regular Checkout
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;