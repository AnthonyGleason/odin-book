const CommentModel = require('../models/Comment');

//create comment
let createComment = async function(author, text){
  try{
    return await CommentModel.create({
      likes: 0, //initializes likes to 0
      shares: 0, //initializes shares to 0
      author: author, //sets author by author input
      dateCreated: Date.now(), //sets current time
      text: text //sets text by text input
    });
  }catch(e){
    console.log(`Error when creating a new comment, ${e}`);
  }
};
//get comment
let getComment = async function(docID){
  try{
    return await CommentModel.findById(docID);
  }catch(e){
    console.log(`Error when getting comment, ${docID}, ${e}`);
  }
};
//get all comments
let getAllComments = async function(){
  try{
    return await CommentModel.find({});
  }catch(e){
    console.log(`Error when getting all comments, ${e}`);
  }
};
//update comment
let updateComment = async function(docID,updatedComment){
  try{
    return await CommentModel.findByIdAndUpdate(docID,updatedComment,{new: true}); //use new options to return updated comment object
  }catch(e){
    console.log(`Error when updating comment, ${docID}, ${e}`);
  }
};
//delete comment
let deleteComment = async function(docID){
  try{
    return await CommentModel.findByIdAndDelete(docID);
  }catch(e){
    console.log(`Error when deleting comment, ${docID}, ${e}`);
  }
};

module.exports ={
  createComment,
  getComment,
  getAllComments,
  updateComment,
  deleteComment
};