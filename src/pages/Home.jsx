import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nike from '../assets/Nike-Red.jpg';
import nike2 from '../assets/Home.jpg';
import nike3 from '../assets/nike3.jpeg';
import nike4 from '../assets/nike4.jpg';

const featuredProducts = [
  {
    id: 1,
    name: 'Air Max Supreme',
    image: Nike,
    price: 16499,
  },
  {
    id: 2,
    name: 'Ultra Boost X',
    image: nike3,
    price: 14999,
  },
  {
    id: 3,
    name: 'Cloud Runner',
    image: nike4,
    price: 13299,
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePromises = featuredProducts.map(product => 
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = product.image;
            img.onload = resolve;
            img.onerror = reject;
          })
        );
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load images');
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing shoes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero-section">
        <img 
          src={nike2}
          alt="Hero shoe"
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Step into Greatness</h1>
          <Link to="/collection" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;