const mongoose = require('mongoose');
const Post = require('./Post');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [10, 'Content must be min 15 character'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Post',
  },
});
CommentSchema.pre('save', async function (next) {
  if (!this.isModified('user')) return next();

  try {
    const post = await Post.findById(this.post);
    post.comments.push(this._id);
    await post.save();
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
