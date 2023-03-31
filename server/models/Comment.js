const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  likes: {
    type: Number,
    required: true,
    min: 0,
  },
  shares: {
    type: Number,
    required: true,
    min: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date:{
    type: Date,
    required: true,
  },
  text:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Comment', CommentSchema);