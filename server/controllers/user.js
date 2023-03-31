const UserModel = require('../models/User');

//create user
let createUser = async function(firstName,lastName,age,email,password){
  return await UserModel.create({
    firstName: firstName,//firstName
    lastName: lastName,//lastName
    age: age,//age
    email: email,//email
    password: password,//password
    friends: [],//friends
    likes: [],//likes
    shares: [],//shares
    dateCreated: Date.now()//dateCreated
  });
};
//get user
let getUser = async function(docID){
  return await UserModel.findById(docID);
};
//get all users
let getAllUsers = async function(){
  return await UserModel.find({});
};
//update user
let updateUser = async function(docID,updatedUser){
  return await UserModel.findByIdAndUpdate(docID,updatedUser);
};
//delete user
let deleteUser = async function(docID){
  return await UserModel.findByIdAndDelete(docID);
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
};