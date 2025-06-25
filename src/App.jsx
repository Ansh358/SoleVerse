import React, { createContext, useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import './App.css';

export const ShopContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  cartCount: 0,
  setCartCount: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});

export const UserContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  signupUsers: [],
  setSignupUsers: () => {}
});

// Get initial users from localStorage
const getInitialUsers = () => {
  const savedUsers = localStorage.getItem('signupUsers');
  return savedUsers ? JSON.parse(savedUsers) : [];
};

// Get initial auth state from localStorage
const getInitialAuthState = () => {
  const savedAuth = localStorage.getItem('isAuthenticated');
  return savedAuth ? JSON.parse(savedAuth) : false;
};

// Get initial user from localStorage
const getInitialUser = () => {
  const savedUser = localStorage.getItem('currentUser');
  return savedUser ? JSON.parse(savedUser) : null;
};

const getInitialCart = () => {
  const savedCart = localStorage.getItem('cartItems');
  return savedCart ? JSON.parse(savedCart) : [];
};

const calculateCartCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

function App() {
  const [cartItems, setCartItems] = useState(getInitialCart());
  const [cartCount, setCartCount] = useState(calculateCartCount(getInitialCart()));
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // User authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());
  const [user, setUser] = useState(getInitialUser());
  const [signupUsers, setSignupUsers] = useState(getInitialUsers());

  useEffect(() => {
    console.log('App component mounted');
    document.body.style.display = 'block';

    const handleError = (event) => {
      setHasError(true);
      setErrorMessage(event.error?.message || 'An unexpected error occurred');
    };

    const handlePromiseRejection = (event) => {
      setHasError(true);
      setErrorMessage(event.reason?.message || 'An unexpected error occurred');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    const newCartCount = calculateCartCount(cartItems);
    setCartCount(newCartCount);
    localStorage.setItem('cartCount', newCartCount.toString());
  }, [cartItems]);
  
  // Save authentication state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  
  // Save current user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);
  
  // Save signup users to localStorage when they change
  useEffect(() => {
    localStorage.setItem('signupUsers', JSON.stringify(signupUsers));
  }, [signupUsers]);

  const resetError = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);

  const addToCart = useCallback((product) => {
    if (!product?.id) return;

    const existingItem = cartItems.find(item => 
      item.id === product.id && item.selectedSize === product.selectedSize
    );

    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, [cartItems]);

  const removeFromCart = useCallback((productId) => {
    if (!productId) return;
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (!productId || newQuantity < 0) return;

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedItems.filter(item => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartCount');
  }, []);

  if (hasError) {
    return (
      <div className="error-container" style={{padding: '20px', textAlign: 'center'}}>
        <h2>Something went wrong</h2>
        <p>{errorMessage || 'An unexpected error occurred.'}</p>
        <button onClick={resetError} style={{marginTop: '10px'}}>Try Again</button>
      </div>
    );
  }

  return (
    <Router>
      <UserContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        signupUsers,
        setSignupUsers
      }}>
        <ShopContext.Provider value={{
          cartItems,
          setCartItems,
          cartCount,
          setCartCount,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart
        }}>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ShopContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
