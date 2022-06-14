const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    minlength: [3, 'Title must be min 3 character'],
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref:'User'
    }
  ]
});

CategorySchema.pre('save', function (next) {
  this.slug = this.makeSlug();
  next();
});

CategorySchema.methods.makeSlug = function () {
  return slugify(this.title, {
    replacement: '-',
    remove: /[*+~.()'/"!:@]/g,
    lower: true,
    trim: true,
  });
};

module.exports = mongoose.model('Category', CategorySchema);
