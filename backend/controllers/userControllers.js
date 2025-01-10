const { addUser, getAllUsers } = require('../models/userModel');

// Controller to add a new user
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData);
    const result = await addUser(userData);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Controller to get all users
const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

module.exports = { registerUser, fetchAllUsers };
