const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { createCategory, createSubcategory, deleteCategoryById, deleteSubcategory, editCategoriesById, getCategories, getCategoriesById, updateSubcategory } = require('../controllers/category');
const router = express.Router();

router.post('/create', auth, createCategory);
router.get('/all', getCategories);
router.get('/get/:id', getCategoriesById);
router.put('/update/:id', auth, editCategoriesById);
router.delete('/delete/:id', auth, deleteCategoryById);

router.post('/subcategory/create', auth, createSubcategory);
router.put('/subcategory/update/:id', auth, updateSubcategory);
router.delete('/subcategory/delete/:id', auth, deleteSubcategory);

module.exports = router;
