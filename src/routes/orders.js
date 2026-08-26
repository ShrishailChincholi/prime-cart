const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

// All order routes require authentication
router.use(isAuthenticated);

// Checkout
router.get('/checkout', orderController.getCheckout);
router.post('/checkout', orderController.placeOrder);

// Order management
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderDetail);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;