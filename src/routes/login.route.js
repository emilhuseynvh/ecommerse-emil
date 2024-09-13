const express = require('express');
const { register, login, addToCart, deleteCart } = require('../controllers/login');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/cart/add', auth, addToCart);
router.delete('/cart/delete/:itemId', auth, deleteCart);

module.exports = router;
