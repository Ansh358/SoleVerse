import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext, UserContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { cartCount } = useContext(ShopContext);
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(UserContext);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <svg width="150" height="40" viewBox="0 0 150 40">
            <text x="10" y="30" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#333">
              SoleVerse
            </text>
           
          </svg>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/collection">Collection</Link>
        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="#" className="login-link authenticated" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="login-text">Logout</span>
            </Link>
            <span className="welcome-text">Hello, {user?.name?.split(' ')[0]}</span>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            <FontAwesomeIcon icon={faUser} />
            <span className="login-text">Login</span>
          </Link>
        )}
        <Link to="/cart" className="cart-link">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;