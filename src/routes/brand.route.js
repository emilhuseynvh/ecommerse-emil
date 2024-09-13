
const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } = require('../controllers/brand');
const router = express.Router();

// Routes for Brand CRUD operations
router.post('/create', auth, createBrand);
router.get('/all', getBrands);
router.get('/get/:id', getBrandById);
router.put('/update/:id', auth, updateBrandById);
router.delete('/delete/:id', auth, deleteBrandById);

module.exports = router;
