# SoleVerse Backend

This is the backend server for the SoleVerse e-commerce platform. It handles customer data management and order processing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solverse
NODE_ENV=development
```

3. Make sure MongoDB is installed and running on your system.

4. Start the server:
- For development:
```bash
npm run dev
```
- For production:
```bash
npm start
```

## API Endpoints

### Customer Management

`POST /api/customer`
- Creates a new customer
- Request body:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```