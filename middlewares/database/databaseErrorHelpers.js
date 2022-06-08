const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
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
  const postId = req.params.id || req.params.post_id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new CustomError('Post not found', 404));
  }
  req.data = post;
  next();
});

const checkPostAndCommentExist = asyncErrorWrapper(async (req, res, next) => {
  const postId = req.params.post_id;
  const commentId = req.params.comment_id;

  const comment = await Comment.findOne({
    _id: commentId,
    post: postId,
  });

  if (!comment) {
    return next(new CustomError('Answer not found', 404));
  }
  next();
});

module.exports = {
  checkUserExist,
  checkPostExist,
  checkPostAndCommentExist,
};
