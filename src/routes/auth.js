const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/auth');

// Login routes
router.get('/login', isGuest, authController.renderLogin);
router.post('/login', isGuest, authController.login);

// Register routes
router.get('/register', isGuest, authController.renderRegister);
router.post('/register', isGuest, authController.register);

// Logout
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;