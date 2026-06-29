const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, changePassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { registerValidation, loginValidation, changePasswordValidation } = require('../validators/authValidator');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
