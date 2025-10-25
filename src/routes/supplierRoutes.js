const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/supplierController');

router.get('/', getAllProducts);

module.exports = router;
