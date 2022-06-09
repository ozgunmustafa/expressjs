const mongoose = require('mongoose');
const slugify = require('slugify');
const Category = require('./Category');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
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
  category: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Category',
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
});
PostSchema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    next();
  }
  try {
    const category = await Category.findById(this.category);
    category.posts.push(this._id);
    await category.save();
    next();
  } catch (err) {
    return next(err);
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
