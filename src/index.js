// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/config.js';

import checkoutroute from './routes/checkoutroutes.js';
import cartRoutes from './routes/cartroutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutroute);

app.get('/health', (req, res) => {
  res.json({
    status: '✅ Product Service running',
    timestamp: new Date().toISOString()
  });
});

// Connect to database before starting server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
  });
})();

export default app;
