const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const jwt = require('jsonwebtoken');
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require('../../helpers/authorization/tokenHelpers');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;

  if (!isTokenIncluded(req)) {
    return next(
      new CustomError('You are not authorized to access this route', 401),
    );
  }
  const accessToken = getAccessTokenFromHeader(req);

  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new CustomError('Token is Expired', 401));
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (user.role !== 'admin') {
    return next(new CustomError('This url is public for admins. ', 403));
  }
  next();
});

const checkPostOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const post = await Post.findById(postId);

  console.log('Birinci', post.user);
  console.log('ikinci', userId);

  if (post.user != userId) {
    return next(new CustomError('Only owner can handle this operation ', 403));
  }
  next();
});

const checkCommentOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const commentId = req.params.comment_id;

  const comment = await Comment.findById(commentId);

  if (comment.user != userId) {
    return next(new CustomError('Only owner can handle this operation ', 403));
  }
  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  checkPostOwnerAccess,
  checkCommentOwnerAccess,
};
