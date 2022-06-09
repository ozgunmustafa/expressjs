const express = require('express');
const {
  getAllCategories,
  getSingleCategory,
  createCategory,
  getAllPostByCategory,
} = require('../controllers/categories');
const { checkCategoryExist } = require('../middlewares/database/databaseErrorHelpers');
const router = express.Router();

router.get('/', getAllCategories);
//router.get('/:id', checkCategoryExist, getSingleCategory);
router.get('/:id', checkCategoryExist, getAllPostByCategory);
router.post('/create',createCategory)

module.exports = router;
