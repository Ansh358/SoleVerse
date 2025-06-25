import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../App';
import { getProductById } from './Collection';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const foundProduct = getProductById(id);
        if (!foundProduct) {
          setError('Product not found');
          setIsLoading(false);
          return;
        }

        // Preload product image
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = foundProduct.image;
          img.onload = resolve;
          img.onerror = reject;
        });

        setProduct(foundProduct);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load product image');
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/collection')}>Back to Collection</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Product not found</p>
        <button onClick={() => navigate('/collection')}>Back to Collection</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart({ ...product, selectedSize });
  };

  return (
    <div className="product-details">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="description">{product.description}</p>
        
        <div className="size-selection">
          <h3>Select Size</h3>
          <div className="size-grid">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;