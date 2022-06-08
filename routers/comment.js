const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAccessToRoute,
  checkCommentOwnerAccess,
} = require('../middlewares/authorization/auth');
const {
  addNewCommentToPost,
  getAllCommentsByPost,
  getSingleComment,
  editComment,
  likeComment,
  deleteComment,
} = require('../controllers/comment');
const {
  checkPostAndCommentExist,
} = require('../middlewares/database/databaseErrorHelpers');

router.post('/', getAccessToRoute, addNewCommentToPost);
router.get('/', getAllCommentsByPost);
router.get('/:comment_id', checkPostAndCommentExist, getSingleComment);
router.put(
  '/:comment_id/edit',
  [checkPostAndCommentExist, getAccessToRoute, checkCommentOwnerAccess],
  editComment,
);
router.delete(
  '/:comment_id/delete',
  [checkPostAndCommentExist, getAccessToRoute, checkCommentOwnerAccess],
  deleteComment,
);
router.get(
  '/:comment_id/like',
  [checkPostAndCommentExist,getAccessToRoute],
  likeComment,
);


module.exports = router;
