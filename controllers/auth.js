const User = require('../models/User');
const Category = require('../models/Category');

const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const {
  validateUserInput,
  decryptPassword,
} = require('../helpers/input/inputHelpers');

const { sentJwtToClient } = require('../helpers/authorization/tokenHelpers');

const sendEmail = require('../helpers/libraries/sendEmail');

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sentJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError('Please check your inputs', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!decryptPassword(password, user.password)) {
    return next(new CustomError('Please check your credentials', 400));
  }
  //console.log(user);
  sentJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: false,
      expires: new Date(Date.now()),
      secure: NODE_ENV === 'development' ? false : true,
    })
    .json({
      success: true,
      message: 'Logout Successfull',
    });
});

const getUser = asyncErrorWrapper(async (req, res, next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
    },
  });
});
const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_img: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!req.file) {
    return next(new CustomError('Please select a file', 400));
  }
  res.status(200).json({
    success: true,
    data: user,
    message: 'Image Upload Successfull',
  });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError('There is no user with that email', 400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
  const emailTemplate = `
  <h1>Reset Your Password</h1>
  <p>This <a href='${resetPasswordUrl}' targer='_blank'>Link</a> will expire in 1 hour. </p>
  `;
  try {
    await sendEmail({
      from: `WHTHPND ${process.env.SMTP_USER}`,
      to: resetEmail,
      subject: 'Reset Your Password',
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent your email.',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new CustomError("Email Couldn't be sent", 500));
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;
  if (!resetPasswordToken) {
    return next(new CustomError('Please provide a valid token', 400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError('Password reset token is expired', 404));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Reset password process succesfully completed.',
  });
});
const editPersonalInfo = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    message: 'User updated successfully!',
    data: user,
  });
});

const followUser = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.params.user_id; //istek yapılan kullanıcı
  const authId = req.user.id; //isteği yapan

  const user = await User.findById(userId);
  const auth = await User.findById(authId);

  if (user.followers.includes(authId)) {
    const userIndex = user.followers.indexOf(authId);
    const authIndex = auth.followingUser.indexOf(userId);

    user.followers.splice(userIndex, 1);
    auth.followingUser.splice(authIndex, 1);

    await user.save();
    await auth.save();
    return res.status(200).json({
      message: 'Unfollowed',
      success: true,
    });
  }
  user.followers.push(authId);
  auth.followingUser.push(userId);
  await user.save();
  await auth.save();
  return res.status(200).json({
    success: true,
    message: 'Followed 👍',
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  imageUpload,
  forgotPassword,
  resetPassword,
  editPersonalInfo,
  followUser,
};
