const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controller/authController');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
