const express = require('express');
const { registerUser, fetchAllUsers } = require('../controllers/userControllers');
const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to get all users
router.get('/users', fetchAllUsers);

module.exports = router;
