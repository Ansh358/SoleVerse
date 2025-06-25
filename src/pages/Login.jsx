import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get user context
  const { isAuthenticated, setIsAuthenticated, user, setUser, signupUsers, setSignupUsers } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }
      
      // Check if user exists in signupUsers
      const userExists = signupUsers.find(
        user => user.email === formData.email && user.password === formData.password
      );
      
      if (userExists) {
        // Set authentication state
        setIsAuthenticated(true);
        setUser(userExists);
        setSuccess('Login successful!');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid credentials');
      }
    } else {
      // Signup validation
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      // Check if email already exists
      const emailExists = signupUsers.some(user => user.email === formData.email);
      if (emailExists) {
        setError('Email already registered');
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };
      
      // Add to signupUsers
      setSignupUsers([...signupUsers, newUser]);
      setSuccess('Account created successfully! You can now login.');
      
      // Switch to login form after a short delay
      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? 'Login to SoleVerse' : 'Create Account'}</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          {!isLogin && (
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faPhone} className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-icon-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          
          <div className="form-footer">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span 
                className="toggle-auth-link" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
            {isLogin && <p className="forgot-password">Forgot Password?</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;