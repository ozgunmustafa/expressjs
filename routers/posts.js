const express = require('express');
const comment = require('./comment');

const {
  checkPostExist,
} = require('../middlewares/database/databaseErrorHelpers');
const {
  createPost,
  getAllPost,
  getSinglePost,
  editPost,
  deletePost,
  likePost,
} = require('../controllers/posts');
const {
  getAccessToRoute,
  checkPostOwnerAccess,
} = require('../middlewares/authorization/auth');

const router = express.Router();

router.get('/', getAllPost);
router.get('/:id', checkPostExist, getSinglePost);
router.post('/create', getAccessToRoute, createPost);
router.put(
  '/:id/edit',
  [getAccessToRoute, checkPostExist, checkPostOwnerAccess],
  editPost,
);
router.delete(
  '/:id/delete',
  [getAccessToRoute, checkPostExist, checkPostOwnerAccess],
  deletePost,
);

router.get('/:id/like', [getAccessToRoute, checkPostExist], likePost);
router.use('/:post_id/comments', checkPostExist, comment);


module.exports = router;
