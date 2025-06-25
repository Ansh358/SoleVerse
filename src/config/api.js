const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  customer: `${VITE_API_URL}/customer`,
  createPaypalOrder: `${VITE_API_URL}/create-paypal-order`,
  capturePaypalOrder: `${VITE_API_URL}/capture-paypal-order`,
  products: `${VITE_API_URL}/products`
};

export const getRequestHeaders = () => ({
  'Content-Type': 'application/json'
});

export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw error;
};
