var express = require('express');
const { createUser, getUser, updateUser, getUserByEmail } = require('../controllers/user');
const {createPost} = require('../controllers/post');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
//setup dotenv
const env = require('dotenv');
env.config();

//greeting
router.get('/', function(req, res, next) {
  res.status(200).json({message: 'welcome to the api!'});
});

//login
router.post('/login',async function(req,res,next){
  const emailInput = req.body.email; //get the email input from the request body
  const passwordInput = req.body.password; //get the password input from the request body
  const user = await getUserByEmail(emailInput); //get the user object from mongodb
  const match = await bcrypt.compare(passwordInput, user.password); //compare the hashed password to the inputted password
  if (match){
    const token = jwt.sign({ id: user._id }, SECRET); //sign a jwt token
    res.status(200).json({ token }); //send the token to client 
  }else{
    res.status(401).json({message: 'password do not match'});
  };
});

//create a user
router.post('/user',passport.authenticate(),async function(req,res,next){
  //hash password
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  //create a new user sending user inputs to the createUser model.
  try{
    const user = await createUser(
      req.body.firstName,//firstName
      req.body.lastName,//lastName
      req.body.age,//age
      req.body.email,//email
      hashedPassword//password
    );
    res.status(200).json({user: user});
  }catch(e){
    console.log(`Error when creating a new user, ${e}`);
    res.status(500).json({err: 'Internal Server Error'});
  }
});

//get a user
router.get('/user/:id', passport.authenticate(),async function(req,res,next){
  try{
    const user = await getUser(req.params.id); //get a user with docID from url params
    res.status(200).json({user: user});
  }catch(e){
    console.log(`There was an error when getting a user, ${e}`);
    res.status(500).json({err: 'Internal Server Error'});
  }
});

//update a user
router.put('/user/:id', passport.authenticate(),async function(req,res,next){
  //get user id to be updated
  const docID = req.params.id;
  if (docID!==req.user._id) res.json({err: "cannot update the data for another user"});
  try{
    const user = await updateUser(docID,{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      friendRequests: req.body.friendRequests,
      friends: req.body.friends,
      likes: req.body.likes,
      shares: req.body.shares,
      dateCreated: req.body.dateCreated,
    });
    res.status(200).json({user: user});
  }catch(e){
    console.log(`Error when updating user information, ${e}`);
    res.status(401).json({err: 'unauthorized'});
  }
});

//send a friend request to another user. :id refers to another user who the person sending the request wants to friend request
router.post('/user/:id/request',passport.authenticate(), async(req,res,next)=>{
  //get recieving users id from url
  const recieveReqUser = req.params.id;
  //get the sending user url from body
  const sendingReqUser = req.user._id;
  try{
    //update the recieving users Friend Requests array, fill in the rest of the data with the current user information
    let user = await getUser(recieveReqUser);
    user.friendRequests.push(sendingReqUser);
    user = await updateUser(recieveReqUser,user);
    res.status(200).json({user: user});
  }catch(e){
    console.log(`Error when sending a friend request to user, ${recieveReqUser}, ${e}`);
    res.status(500).json({err: 'error sending friend request'});
  }
});

//accept a friend request from another user. :id refers to the user making the request
router.post('/user/:id/accept',passport.authenticate(),async(req,res,next)=>{
  //verify user is allowed to make request
  if (req.params.id!==req.user._id) res.status(401).json({'err': 'cannot accept a friend request for another user'});
  const userOneID = req.params.id;
  const userTwoID = req.body.friendDocID;
  try{
    //update the friend array for both users
    let userOneObj = await getUser(userOneID);
    let userTwoObj = await getUser(userTwoID);
    userOneObj.friends.push(userTwoID);
    userTwoObj.friends.push(userOneID);
    //clear the friend request from the current user's friendRequests array 
    userOneObj.splice(userOneObj.friendRequests.indexOf(userTwoID),1);
    //update both users
    await updateUser(userOneID, userOneObj);
    await updateUser(userTwoID, userTwoObj);
    res.status(200).json({message: 'succesfully processed accept friend request'});
  }catch(e){
    console.log(`Error when accepting a friend request, ${e}`);
    res.status(500).json({err: 'error processing accept friend request'});
  }
});

//decline a friend request from another user. :id refers to the user making the request
router.post('/user/:id/decline',passport.authenticate(),async (req,res,next)=>{
  //verify user is the user making the request to decline
  if (req.params.id!==req.user._id) res.status(401).json({err: 'cannot decline a friend request for another user'});
  const userOneID = req.params.id;
  const userTwoID = req.body.friendDocID;
  try{
    let userOneObj = await getUser(userOneID);
    //clear the friend request from the current user's friendRequests array 
    userOneObj.splice(userOneObj.friendRequests.indexOf(userTwoID),1);
    //update user
    const user = await updateUser(userOneID, userOneObj);
    res.status(200).json({user: user});
  }catch(e){
    console.log(`Error when accepting a friend request, ${e}`);
    res.status(500).json({err: 'error when accepting a friend request'});
  }
});

//create a post
router.post('/post',async(req,res,next)=>{
  //get docID of current user
  //verify user is signed in and docID is theirs
  //create a new post
  try{
    const post = await createPost(
      author,//author
      text,//text
      title//title
    );
    res.status(200).json({'post': post});
  }catch(e){
    console.log(`Error when creating a post, ${e}`);
  }
  //get user information from mongodb
  //update the posts array pushing the new docID
});
//update a post
//delete a post
//like a post
//unlike a post
//share a post
//unshare a post

//create a comment on a post
//update comment
//delete a comment
//share a comment
//unshare a comment
//like a comment
//unlike a comment

module.exports = router;
