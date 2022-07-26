const Post = require('../models/Post');
const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const getAllPost = asyncErrorWrapper(async (req, res, next) => {
  const posts = await Post.find().populate('category').populate({
    path: 'user',
    select: 'name profile_img',
  });

  return res.status(200).json({
    success: true,
    data: posts,
  });
});

const createPost = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;
  const post = await Post.create({
    ...information,
    user: req.user.id,
    category: req.body.categoryId,
  });
  res.status(200).json({
    success: true,
    message: 'Post created successfully!',
    data: post,
  });
});

const getSinglePost = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
    data: req.data,
  });
});

const editPost = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  let post = await Post.findById(id);
  post.title = title;
  post.content = content;

  post = await post.save();
  return res.status(200).json({
    success: true,
    message: 'Updated Successfully',
    data: post,
  });
});

const deletePost = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: 'Deleted Successfully!',
  });
});

const likePost = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const user = await User.findById(req.user.id);

  if (post.likes.includes(req.user.id)) {
    const postIndex = post.likes.indexOf(req.user.id);
    const userIndex = user.likes.indexOf(id);
    post.likes.splice(postIndex, 1);
    user.likes.splice(userIndex, 1);

    await post.save();
    await user.save();
    return res.status(200).json({
      message: 'Undo like',
      success: true,
      data: post,
    });
  }

  post.likes.push(req.user.id);
  user.likes.push(id);
  await post.save();
  await user.save();
  return res.status(200).json({
    message: 'Liked 👍',
    success: true,
    //data: post,
  });
});

module.exports = {
  getAllPost,
  getSinglePost,
  createPost,
  editPost,
  deletePost,
  likePost,
};
