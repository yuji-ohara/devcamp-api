const express = require('express');
const { registerUser, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/details', protect, updateDetails);
router.put('/password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);


module.exports = router;