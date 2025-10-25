const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/supplierRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));

module.exports = app; // for testing
