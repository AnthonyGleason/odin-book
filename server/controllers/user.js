const UserModel = require('../models/User');

//create user
let createUser = async function(firstName,lastName,age,email,password){
  try{
    return await UserModel.create({
      firstName: firstName,//firstName
      lastName: lastName,//lastName
      age: age,//age
      email: email,//email
      password: password,//password
      friendRequests: [], //friend requests
      friends: [],//friends
      likes: [],//likes
      posts: [],//posts
      shares: [],//shares
      comments: [],//comments
      dateCreated: Date.now()//dateCreated
    });
  }catch(e){
    console.log(`Error creating a new user ${e}`);
  };
};
//get user
let getUser = async function(docID){
  try{
    return await UserModel.findById(docID);
  }catch(e){
    console.log(`Error getting data for user, ${docID}, ${e}`);
  };
  
};
//get user by email
let getUserByEmail=async function(email){
  try{
    return await UserModel.findOne({'email': email});
  }catch(e){
    console.log(`Error when getting a user with email, ${email}, ${e}`);
  }
};
//get all users
let getAllUsers = async function(){
  try{
    return await UserModel.find({});
  }catch(e){
    console.log(`Error when getting data for all users, ${e}`);
  };
};
//update user
let updateUser = async function(docID,updatedUser){
  try{
    return await UserModel.findByIdAndUpdate(docID,updatedUser,{new: true}); //new: true option returns the updated user object
  }catch(e){
    console.log(`Error when updating user, ${docID}, ${e}`);
  };
};
//delete user
let deleteUser = async function(docID){
  try{
    return await UserModel.findByIdAndDelete(docID);
  }catch(e){
    console.log(`Error when deleting user, ${docID}, ${e}`);
  };
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail
};