const Category = require('../models/Category');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const createCategory = asyncErrorWrapper(async (req, res, next) => {
  const formData = req.body;
  const category = await Category.create({
    ...formData,
  });

  res.status(200).json({
    success: true,
    message: 'Category created successfully!',
    data: category,
  });
});

const getAllCategories = asyncErrorWrapper(async (req, res, next) => {
  const categories = await Category.find();
  return res.status(200).json({
    success: true,
    data: categories,
  });
});

const getSingleCategory = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  return res.status(200).json({
    success: true,
    data: req.data,
  });
});
const getAllPostByCategory = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('posts');
  //const posts = category.posts;

  return res.status(200).json({
    success: true,
    data: category,
  });
});
module.exports = {
  createCategory,
  getSingleCategory,
  getAllCategories,
  getAllPostByCategory,
};
