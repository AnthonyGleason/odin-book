const UserModel = require('../models/User');

//create user
let createUser = async function(firstName,lastName,age,email,password){
  UserModel.create({
    firstName: firstName,//firstName
    lastName: lastName,//lastName
    age: age,//age
    email: email,//email
    password: password,//password
    friends: [],//friends
    likes: [],//likes
    shares: [],//shares
    dateCreated: Date.now()//dateCreated
  })
};
//get user
//get all users
//update user
//delete user

module.exports = {
  createUser
};