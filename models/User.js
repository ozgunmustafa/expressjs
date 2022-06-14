const mongose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Post = require('./Post');

const Schema = mongose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  password: {
    type: String,
    minlength: [6, 'Password length must be min 6 characters'],
    required: [true, 'Password field is required'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  about: { type: String },
  links: {
    type: Object,
  },
  profile_img: {
    type: String,
    default: '',
  },
  birthday: {
    type: Date,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  likes: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  followingCategory: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'Category',
    },
  ],
  followingUser: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

UserSchema.methods.getResetPasswordTokenFromUser = function () {
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const randomHexString = crypto.randomBytes(15).toString('hex');
  const resetPasswordToken = crypto
    .createHash('SHA256')
    .update(randomHexString)
    .digest('hex');

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};

UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

//When user remove delete related posts
UserSchema.post('remove', async function () {
  await Post.deleteMany({
    user: this._id,
  });
});

module.exports = mongose.model('User', UserSchema);
