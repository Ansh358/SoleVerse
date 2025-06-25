import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../App';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useContext(ShopContext);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/collection" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Size: {item.selectedSize}</p>
              <p className="price">₹{(item.price * item.quantity).toFixed(2)}</p>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button 
                  className="quantity-btn plus"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
              aria-label="Remove item"
            >Remove
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="total">
          <h3>Total:</h3>
          <p>₹{calculateTotal()}</p>
        </div>
        
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
        >
          Proceed to Checkout (Cash on Delivery)
        </button>
      </div>
    </div>
  );
};

export default Cart;