import React, {useState,useEffect} from 'react';
import '../styles/post.css';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

function App() {
  const [post, setPost] = useState<any>();
  const {postID} = useParams();
  useEffect(()=>{
    getPostData(setPost,postID);
  },[]);
  if (post){
    console.log(post);
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
            post.comments.map((i:any)=>{
              return(
              <div>
                comment placeholder
              </div>)
            })
          }
          <form className='new-comment-form'>
            
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

let getPostData = async function(setPost:any,postID:any){
  const jwt:any = Cookies.get('jwt');
  
  //get currently signed in user info
  try{
    const response = await fetch(`http://localhost:5000/api/post/${postID}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    const jsonData = await response.json();
    setPost(jsonData.post);
  }catch(e){
    console.log(`An error, ${e} has occured when getting currently signed in user data`);
  }
};