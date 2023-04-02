const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
  }], 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Post',PostSchema);