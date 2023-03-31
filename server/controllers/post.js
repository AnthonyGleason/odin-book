const PostModel = require('../models/Post');

//create a post
let createPost = async function(author,text,title){
  try{
    return await PostModel.create({
      comments: [], //comments initialized to empty array
      likes: [], //likes initialized to empty array
      shares: [], //shares initialized to an empty array
      author: author, //set author from input, refers to a docID of the post author
      text: text, //set text from input
      title: title, //set title from input
      dateCreated: Date.now(), //set current date
    });
  }catch(e){
    console.log(`Error when creating a new post, ${e}`);
  };
};
//get a post
let getPost = async function(docID){
  try{
    return await PostModel.findById(docID);
  }catch(e){
    console.log(`Error when getting data for post, ${docID}, ${e}`);
  };
};
//get all posts
let getAllPosts = async function(){
  try{
    return await PostModel.find({});
  }catch(e){
    console.log(`Error when getting data for all posts, ${e}`);
  };
};
//update a post
let updatePost = async function(docID,updatedPost){
  try{
    return await PostModel.findByIdAndUpdate(docID,updatedPost,{new: true}); //returns the updated user object by using the new: true option
  }catch(e){
    console.log(`Error when updating post, ${docID}, ${e}`);
  };
};
//delete a post
let deletePost = async function(docID){
  try{
    return await PostModel.findByIdAndDelete(docID);
  }catch(e){
    console.log(`Error when deleting post, ${docID}, ${e}`);
  };
};
module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost
};