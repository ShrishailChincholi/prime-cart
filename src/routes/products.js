const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetail);

// Admin routes
router.post('/create', isAuthenticated, isAdmin, productController.createProduct);

module.exports = router;