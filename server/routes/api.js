var express = require('express');
const { createUser, getUser, updateUser, getUserByEmail } = require('../controllers/user');
const {createPost,getPost, updatePost, deletePost} = require('../controllers/post');
const {createComment, updateComment, getComment} = require('../controllers/comment');
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
//get logged in status
router.get('/',passport.authenticate('jwt',{session: false}),async function(req,res,next){
  res.status(200).json({signedIn: true});
});
//login
router.post('/login',async function(req,res,next){
  const emailInput = req.body.email; //get the email input from the request body
  const passwordInput = req.body.password; //get the password input from the request body
  const user = await getUserByEmail(emailInput); //get the user object from mongodb
  const match = await bcrypt.compare(passwordInput, user.password); //compare the hashed password to the inputted password
  if (match){
    const token = jwt.sign({ id: user._id }, SECRET); //sign a jwt token
    //http only is disabled so we can access the cookie value in the client
    res.status(200).cookie('jwt', token, { httpOnly: false, secure: true });
  }else{
    res.status(401).json({message: 'password do not match'});
  };
});

//create a user
router.post('/user',passport.authenticate('jwt',{session: false}),async function(req,res,next){
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
router.get('/user/:id', passport.authenticate('jwt',{session: false}),async function(req,res,next){
  try{
    const user = await getUser(req.params.id); //get a user with docID from url params
    res.status(200).json({user: user});
  }catch(e){
    console.log(`There was an error when getting a user, ${e}`);
    res.status(500).json({err: 'Internal Server Error'});
  }
});

//update a user
router.put('/user/:id', passport.authenticate('jwt',{session: false}),async function(req,res,next){
  //get user id to be updated
  const docID = req.params.id;
  if (docID!==req.user._id) res.json({err: "cannot update the data for another user"});
  try{
    const user = await getUser(docID);
    const updatedUser = await updateUser(docID,{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      friendRequests: user.friendRequests,
      friends: user.friends,
      likes: user.likes,
      shares: user.shares,
      comments: user.comments,
      dateCreated: user.dateCreated,
    });
    res.status(200).json({user: updatedUser});
  }catch(e){
    console.log(`Error when updating user information, ${e}`);
    res.status(401).json({err: 'unauthorized'});
  }
});

//send a friend request to another user. :id refers to another user who the person sending the request wants to friend request
router.post('/user/:id/request',passport.authenticate('jwt',{session: false}), async(req,res,next)=>{
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
router.post('/user/:id/accept',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
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
router.post('/user/:id/decline',passport.authenticate('jwt',{session: false}),async (req,res,next)=>{
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
router.post('/post',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get docID of current user
  const docID = req.user._id;
  //create a new post
  try{
    //create post
    const post = await createPost(
      req.body.docID,//author
      req.body.text,//text
      req.body.title//title
    );
    //get user
    let user = await getUser(docID);
    //add post id to user posts array
    user.posts.push(post._id);
    //update user
    user = await updateUser(docID,user);
    res.status(200).json({'user': user});
  }catch(e){
    console.log(`Error when creating a post, ${e}`);
    res.status(500).json({err: 'Error when creating a new post'});
  }
});

//update a post
router.put('/post/:id',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //see if post was created by the current authenticated user
  let post = await getPost(req.params.id);
  if (req.user._id!==post.author) res.status(401).json({err: 'Cannot edit a post you did not create'});
  try{
    const updatedPost = await updatePost(req.params.id,{
      comments: post.comments, //comments from post
      likes: post.likes, //likes taken from post
      shares: post.shares, //shares taken from post
      author: post.author, //author taken from post
      text: req.body.text, //set text from input
      title: req.body.title, //set title from input
      dateCreated: post.date, //date taken from post
    });
    res.status(200).json({post:updatedPost});
  }catch(e){
    console.log(`There was an error when updating post ${req.params.id}, ${e}`);
    res.status(500).json({err: `Internal error occured when updating the post ${e}`});
  }
});

//allow users to delete their own posts
router.delete('/post/:id',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //see if post was created by the current authenticated user
  let post = await getPost(req.params.id);
  if (req.user._id!==post.author) res.status(401).json({err: 'Cannot delete a post you did not create'});
  try{
    await deletePost(req.params.id);
    res.status(200).json({message: `deleted a post with docID , ${req.params.id}`});
  }catch(e){
    console.log(`There was an error when updating post ${req.params.id}, ${e}`);
  };
});

//like a post
router.put('/post/:id/like',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const postID = req.params.id; //get post id
  const userID = req.user._id; //get user id
  try{
    //get data from mongodb
    const post = await getPost(postID); //get post obj
    const user = await getUser(userID); //get user obj
    //add user id to post likes array
    post.likes.push(user._id);
    //add post id to user likes array
    user.likes.push(post._id);
    //update both the user and post;
    await updatePost(postID, post);
    await updateUser(userID, user);
    res.status(200).json({message: 'post sucessfully liked!'});
  }catch(e){
    console.log(`Error when handling post like, ${e}`);
    res.status(500).json({err: 'error handling post like'});
  }
});

//unlike a post
router.delete('/post/:id/like',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const postID = req.params.id; //get post id
  const userID = req.user._id; //get user id
  try{
    //get data from mongodb
    const post = await getPost(postID); //get post obj
    const user = await getUser(userID); //get user obj
    //remove the user id from the post likes array
    post.likes.splice(post.likes.indexOf(userID),1);
    //remove the post id from the user likes array
    user.likes.splice(user.likes.indexOf(postID),1);
    //update both the user and post;
    await updatePost(postID, post);
    await updateUser(userID, user);
    res.status(200).json({message: 'post sucessfully unliked'});
  }catch(e){
    console.log(`Error when handling post like, ${e}`);
    res.status(500).json({err: 'error handling post unlike'});
  }
});

//share a post
router.put('/post/:id/share',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const postID = req.params.id; //get post id
  const userID = req.user._id; //get user id
  try{
    //get data from mongodb
    const post = await getPost(postID); //get post obj
    const user = await getUser(userID); //get user obj
    //add user id to post shares array
    post.shares.push(user._id);
    //add post id to user shares array
    user.shares.push(post._id);
    //update both the user and post;
    await updatePost(postID, post);
    await updateUser(userID, user);
    res.status(200).json({message: 'post sucessfully shared'});
  }catch(e){
    console.log(`Error when handling post share, ${e}`);
    res.status(500).json({err: 'error handling post share'});
  }
});

//unshare a post
router.delete('/post/:id/share',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const postID = req.params.id; //get post id
  const userID = req.user._id; //get user id
  try{
    //get data from mongodb
    const post = await getPost(postID); //get post obj
    const user = await getUser(userID); //get user obj
    //remove the user id from the post shares array
    post.shares.splice(post.shares.indexOf(userID),1);
    //remove the post id from the user shares array
    user.shares.splice(user.shares.indexOf(postID),1);
    //update both the user and post;
    await updatePost(postID, post);
    await updateUser(userID, user);
    res.status(200).json({message: 'post sucessfully unshared'});
  }catch(e){
    console.log(`Error when handling post unshare, ${e}`);
    res.status(500).json({err: 'error handling post unshare'});
  }
});

//create a comment on a post
router.post('/post/:id/comment',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  const postID = req.params.id;
  const userID = req.user._id;
  try{
    const comment = await createComment(
      userID, //author
      req.body.text//text
    );
    //update comments arrays
    let post = await getPost(postID);
    let user = await getUser(userID);
    post.comments.push(comment._id);
    user.comments.push(comment._id);
    //update mongodb
    await updatePost(postID,post);
    await updateUser(userID,user);
    res.status(200).json({message: `created a comment with docID ${comment._id}`});
  }catch(e){
    console.log(`Error when creating comment, ${e}`);
    res.status(500).json({err: `error when creating a comment on post, ${postID}, with user, ${userID}`});
  };
});

//update comment
router.put('/post/:id/comment/:commentID',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  const postID = req.params.id;
  const commentID = req.params.commentID;
  try{
    //check to see if user is updating a comment they made
    let post = await getPost(postID);
    let comment = await getComment(commentID);
    if (req.user._id!==comment.author) res.status(401).json({err: `cannot update another user's comment`});
    //update comment data with input
    comment.text=req.body.text;
    //update mongodb
    await updateComment(commentID,comment);
    res.status(200).json({message: `updated a comment with docID ${comment._id}`});
  }catch(e){
    console.log(`Error when updating comment, ${e}`);
    res.status(500).json({err: `error when updating a comment on post, ${postID}, with user, ${userID}`});
  };
});

//delete a comment
router.delete('/post/:id/comment/:commentID',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  const postID = req.params.id;
  const userID = req.user._id;
  const commentID = req.params.commentID;
  const commentObj = await getComment(commentID);
  if (commentObj.author!==req.user._id) res.status(401).json({err: `cannot delete a comment not made by this user`});
  try{
    //comment is not removed from database incase it was something harmful from the user side it is hidden
    //update comments arrays
    let post = await getPost(postID);
    let user = await getUser(userID);
    post.comments.splice(post.comments.indexOf(commentID,1));
    user.comments.splice(user.comments.indexOf(commentID,1));
    //update mongodb
    await updatePost(postID,post);
    await updateUser(userID,user);
    res.status(200).json({message: `deleted a comment with docID ${commentID}`});
  }catch(e){
    console.log(`Error when deleting comment, ${e}`);
    res.status(500).json({err: `error when deleting a comment on post, ${postID}, with user, ${userID}`});
  };
});

//share a comment
router.put('/post/:id/comment/:commentID/share',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const commentID = req.params.commentID;
  const userID = req.user._id;
  //get post and comment objects
  try{
    let comment = await getComment(commentID);
    let user = await getUser(userID);
    comment.shares.push(userID);
    user.shares.push(commentID);
    //update user and comments;
    await updateComment(commentID, comment);
    await updateUser(userID, user);
    res.status(200).json({message: `succesfully shared a comment, ${commentID}`});
  }catch(e){
    res.status(500).json({err: `internal error occured when sharing comment, ${commentID}`});
  };
});

//unshare a comment
router.delete('/post/:id/comment/:commentID/share',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const commentID = req.params.commentID;
  const userID = req.user._id;
  //get post and comment objects
  try{
    let comment = await getComment(commentID);
    let user = await getUser(userID);
    comment.shares.splice(comment.shares.indexOf(userID),1);
    user.shares.splice(user.shares.indexOf(commentID),1);
    //update user and comments;
    await updateComment(commentID, comment);
    await updateUser(userID, user);
    res.status(200).json({message: `succesfully unshared a comment, ${commentID}`});
  }catch(e){
    res.status(500).json({err: `internal error occured when unsharing comment, ${commentID}`});
  };
});

//like a comment
router.put('/post/:id/comment/:commentID/like',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
  //get ids
  const commentID = req.params.commentID;
  const userID = req.user._id;
  //get post and comment objects
  try{
    let comment = await getComment(commentID);
    let user = await getUser(userID);
    comment.likes.push(userID);
    user.likes.push(commentID);
    //update user and comments;
    await updateComment(commentID, comment);
    await updateUser(userID, user);
    res.status(200).json({message: `succesfully liked a comment, ${commentID}`});
  }catch(e){
    res.status(500).json({err: `internal error occured when liking comment, ${commentID}`});
  };
});

//unlike a comment
router.delete('/post/:id/comment/:commentID/like',passport.authenticate('jwt',{session: false}),async(req,res,next)=>{
   //get ids
   const commentID = req.params.commentID;
   const userID = req.user._id;
   //get post and comment objects
   try{
     let comment = await getComment(commentID);
     let user = await getUser(userID);
     comment.likes.splice(comments.likes.indexOf(userID),1);
     user.likes.splice(comments.likes.indexOf(commentID),1);
     //update user and comments;
     await updateComment(commentID, comment);
     await updateUser(userID, user);
     res.status(200).json({message: `succesfully unliked a comment, ${commentID}`});
   }catch(e){
     res.status(500).json({err: `internal error occured when unliking comment, ${commentID}`});
   };
});

module.exports = router;