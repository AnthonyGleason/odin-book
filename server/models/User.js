const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0,
    max: 130,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  likes:[{
    type: mongoose.Schema.Types.ObjectId,

  }],
  shares:[{
    type: mongoose.Schema.Types.ObjectId,
  }],
  dateCreated:{
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('User',UserSchema);