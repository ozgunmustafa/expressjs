const Post = require('../models/Post');
const Comment = require('../models/Comment');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const addNewCommentToPost = asyncErrorWrapper(async (req, res, next) => {
  const { post_id } = req.params;
  const user_id = req.user.id;
  const information = req.body;

  const comment = await Comment.create({
    ...information,
    post: post_id,
    user: user_id,
  });
  return res.status(200).json({
    success: true,
    data: comment,
  });
});

const getAllCommentsByPost = asyncErrorWrapper(async (req, res, next) => {
  const { post_id } = req.params;

  const post = await Post.findById(post_id).populate('comments');
  const comments = post.comments;

  return res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});
const getSingleComment = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;

  const comment = await Comment.findById(comment_id)
    .populate({
      path: 'post',
      select: 'title',
    })
    .populate({
      path: 'user',
      select: 'name profile_img',
    });

  return res.status(200).json({
    success: true,
    data: comment,
  });
});
const editComment = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;
  const { content } = req.body;

  let comment = await Comment.findById(comment_id);

  comment.content = content;
  await comment.save();

  return res.status(200).json({
    success: true,
    data: comment,
  });
});
const deleteComment = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;
  const { post_id } = req.params;

  await Comment.findByIdAndRemove(comment_id);

  const post =await Post.findById(post_id);
  post.comments.splice(post.comments.indexOf(comment_id), 1);

  await post.save();

  return res.status(200).json({
    success: true,
    message:"Deleted Successfully"
  })
});
const likeComment = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;
  const comment = await Comment.findById(comment_id);

  if (comment.likes.includes(req.user.id)) {
    const index = comment.likes.indexOf(req.user.id);
    comment.likes.splice(index, 1);
    await comment.save();
    return res.status(200).json({
      message: 'Undo like',
      success: true,
      data: comment,
    });
  }

  comment.likes.push(req.user.id);
  await comment.save();
  return res.status(200).json({
    message: 'Liked 👍',
    success: true,
    data: comment,
  });
});

module.exports = {
  addNewCommentToPost,
  getAllCommentsByPost,
  getSingleComment,
  editComment,
  deleteComment,
  likeComment,
};
