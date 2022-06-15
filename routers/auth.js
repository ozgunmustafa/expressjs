const express = require('express');
const {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editPersonalInfo,
  followUser,
} = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const {
  checkCategoryExist,
} = require('../middlewares/database/databaseErrorHelpers');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

const router = express.Router();
router.get('/:user_id/follow', getAccessToRoute, followUser);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', getAccessToRoute, logout);
router.post('/forgot-password', forgotPassword);
router.put('/edit', getAccessToRoute, editPersonalInfo);
router.put('/reset-password', resetPassword);
router.get('/profile', getAccessToRoute, getUser);
router.post(
  '/upload',
  [getAccessToRoute, profileImageUpload.single('profile_img')],
  imageUpload,
);

module.exports = router;
