const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createProduct, deleteProductById, editProduct, getProductById, getProducts, getProductsByCategory, getProductsBySubcategory, searchProduct } = require('../controllers/products');
const router = express.Router();

// Route handlers
router.post('/create', auth, createProduct);
router.get('/all', getProducts);
router.get('/get/:id', getProductById);
router.patch('/update/:id', auth, editProduct);
router.get('/search', searchProduct);
router.delete('/delete/:id', auth, deleteProductById);

// Routes for category and subcategory
router.get('/category/:category', getProductsByCategory);
router.get('/subcategory/:subcategory', getProductsBySubcategory);

module.exports = router;
