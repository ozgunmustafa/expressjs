const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    minlength: [10, 'Title must be min 10 character'],
  },
  transformedTitle: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [15, 'Content must be min 15 character'],
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});
PostSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    next();
  }
  this.slug = this.makeSlug();
  this.transformedTitle = this.transformTitle();
  next();
});

PostSchema.methods.makeSlug = function () {
  return slugify(this.title, {
    replacement: '-',
    remove: /[*+~.()'/"!:@]/g,
    lower: true,
    trim: true,
  });
};

PostSchema.methods.transformTitle = function () {
  return slugify(this.title, {
    replacement: ' ',
    remove: /[*+~.()'/"!:@]/g,
    lower: true,
  });
};

module.exports = mongoose.model('Post', PostSchema);
