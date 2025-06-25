import { Link } from 'react-router-dom';
import { useState } from 'react';

const productData = [
  {
    id: 1,
    name: 'Air Max Supreme',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    price: 16499,
    description: 'Premium comfort with stylish design',
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 2,
    name: 'Ultra Boost X',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    price: 14999,
    description: 'Revolutionary cushioning technology',
    sizes: [6, 7, 8, 9, 10],
  },
  {
    id: 3,
    name: 'Cloud Runner',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    price: 13299,
    description: 'Lightweight and breathable design',
    sizes: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 4,
    name: 'Street Legend',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    price: 10999,
    description: 'Urban style meets comfort',
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    id: 5,
    name: 'Sprint Elite',
    image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
    price: 13999,
    description: 'Designed for peak performance',
    sizes: [7, 8, 9, 10, 11],
  },
  {
    id: 6,
    name: 'Flex Trainer',
    image: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42',
    price: 12499,
    description: 'Versatile training shoe',
    sizes: [6, 7, 8, 9, 10],
  },
];

export const getProductById = (id) => {
  return productData.find(product => product.id === parseInt(id));
};

const Collection = () => {
  const [products] = useState(productData);

  return (
    <div className="collection">
      <h1>Our Collection</h1>
      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            <p className="description">{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collection;
export { productData as products };