const User = require('../../models/User');
const Post = require('../../models/Post');
const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new CustomError('User not found', 404));
  }
  req.data = user;
  next();
});

const checkPostExist = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return next(new CustomError('Post not found', 404));
  }
  req.data = post;
  next();
});

module.exports = {
  checkUserExist,
  checkPostExist,
};
