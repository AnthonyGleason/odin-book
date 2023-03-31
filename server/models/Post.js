const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
  }],
  likes: {
    type: Number,
    min: 0,
    required
  },
  shares: {
    type: Number,
    min: 0,
    required
  }, 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required 
  },
  text: {
    type: String,
    required
  },
  title: {
    type: String,
    required
  },
  date: {
    type: Date,
    required
  }
});

module.exports = mongoose.model('Post',PostSchema);