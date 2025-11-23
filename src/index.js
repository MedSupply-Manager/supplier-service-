// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/supplierRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// ROUTES
// ==============================
app.use('/api/products', productRoutes);

// ==============================
// HEALTH CHECK ROUTE
// ==============================
app.get('/health', (req, res) => {
  res.json({
    status: '✅ Product Service running',
    timestamp: new Date().toISOString()
  });
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});

export default app; // for testing
