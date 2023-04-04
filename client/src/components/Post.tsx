import React, {useState,useEffect} from 'react';
import '../styles/post.css';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

function App() {
  const [post, setPost] = useState<any>();
  const [commentsArr,setCommentsArr] = useState([]);
  const [commentTextInput, setCommentTextInput] = useState('');
  const {postID} = useParams();
  useEffect(()=>{
    getPostData(setPost,postID,setCommentsArr);
  },[]);
  if (post){
    return (
      <div className="post">
        <div>Title: {post.title}</div>
        <div>Text: {post.text}</div>
        <div>Author: {post._id}</div>
        <div className='post-stats'>
          <div>Likes: {post.likes.length}</div>
          <div>Comments: {post.comments.length}</div>
          <div>Shares: {post.shares.length}</div>
        </div>
        <div className='comments-container'>
          {
            commentsArr.map((i:any)=>{
              console.log(i);
              return(
              <div className='comment' key={Math.random()}>
                <div>{i.text}</div>
                <div>{i.author}</div>
              </div>
              )
            })
          }
          <form className='new-comment-form'>
            <div>
              <label>Text: </label>
              <input  type='text' value={commentTextInput} onChange={(e)=>{setCommentTextInput(e.target.value)}}/>
            </div>
            <button onClick={()=>{createComment(commentTextInput,postID)}} type='button'>Create Comment</button>
          </form>
        </div>
      </div>
    );
  }else{
    return(
      <div></div>
    )
  }
};
export default App;
let createComment = async function( textInput:String,postID:any){
  const jwt:any = Cookies.get('jwt');
  
  //get currently signed in user info
  try{
    const response = await fetch(`http://localhost:5000/api/post/${postID}/comment`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body:JSON.stringify({
        text: textInput
      })
    });
  }catch(e){
    console.log(`An error, ${e} has occured when getting currently signed in user data`);
  }
};

let getPostData = async function(setPost:any, postID:any, setCommentsArr:any){
  const jwt:any = Cookies.get('jwt');
  try{
    let response = await fetch(`http://localhost:5000/api/post/${postID}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    const jsonData = await response.json();
    setPost(jsonData.post);
    //get comment data
    let commentIDArr = jsonData.post.comments;
    let commentArr:any = [];

    const getCommentData = async (id:any) => {
      const response = await fetch(`http://localhost:5000/api/post/${postID}/comment/${id}`,{
        method: "GET",
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
      return response.json();
    };

    const commentData = await Promise.all(commentIDArr.map((id:any) => getCommentData(id)));
    commentData.forEach((data:any) => commentArr.push(data.comment));

    setCommentsArr(commentArr);
  }catch(e){
    console.log(`An error, ${e} has occurred when getting currently signed in user data`);
  }
};
