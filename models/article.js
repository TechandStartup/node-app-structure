const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [2, "Title must be at least 2 characters."],
    maxlength: [100, "Title must be no more than 100 characters"],
    validate: {
      validator: function(value) {
        return /^[\w'",.!? ]+$/.test(value);
      },
      message: props => `${props.value} should only contain letters, numbers, spaces, and '",!?. characters.`
    },
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  published: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true});

module.exports = mongoose.model('Article', articleSchema);