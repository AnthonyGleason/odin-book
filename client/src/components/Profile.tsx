import '../styles/profile.css';
import React, {useState,useEffect} from 'react';
import Cookies from 'js-cookie';

function App() {
  const [currentTab,setCurrentTab] = useState('posts')
  //content states
  const [posts,setPosts] = useState([]);
  const [likes,setLikes] = useState([]);
  const [comments,setComments] = useState([]);
  const [shares,setShares] = useState([]);
  //input states
  const [titleInput,setTitleInput] = useState('');
  const [textInput, setTextInput] = useState('');
  //load getPosts because it is the default tab when first going onto a user's page
  useEffect(()=>{
    switch(currentTab){
      case 'posts':
        getPosts(setPosts);
        break;
      case 'comments':
      case 'likes':
      case 'shares':
    }
  },[currentTab])

  return (
    <div className="profile">
      <ul className='user-nav'>
        <li onClick={()=>{setCurrentTab('posts')}}>Posts</li>
        <li onClick={()=>{setCurrentTab('comments')}}>Comments</li>
        <li onClick={()=>{setCurrentTab('likes')}}>Likes</li>
        <li onClick={()=>{setCurrentTab('shares')}}>Shares</li>
        <li>{currentTab}</li>
      </ul>
      <form>
        <div>
          <label htmlFor='title'>Title: </label>
          <input id='title' name='title' value={titleInput} onChange={(e)=>{setTitleInput(e.target.value)}} />
        </div>
        <div>
          <label htmlFor='text'>Text: </label>
          <input id='text' name='text' value={textInput} onChange={(e)=>{setTextInput(e.target.value)}}/>
        </div>
        <button type='button' onClick={()=>{createPost(titleInput,textInput,setPosts)}} >Create Post</button>
      </form>
      <div className='content-container'>
        {currentTab === 'posts' ?
          posts.map((i:any)=>{
            return(
              <div className='post' key={Math.random()}>
                <div>Title: {i.title}</div>
                <div>Text: {i.text}</div>
                <div>Date Created: {i.dateCreated}</div>
                <div>Author: {i.author}</div>
              </div>
            )
          }) : null
        }
        {currentTab === 'comments' ?
          comments.map((i:any)=>{
            return(
              <div className='comment' key={Math.random()}>
                
              </div>
            )
          }) : null
        }
        {currentTab === 'likes' ?
          likes.map((i:any)=>{
            return(
              <div className='like' key={Math.random()}>
                
              </div>
            )
          }) : null
        }
        {currentTab === 'shares' ?
          shares.map((i:any)=>{
            return(
              <div className='share' key={Math.random()}>
                
              </div>
            )
          }) : null
        }
      </div>
    </div>
  );
}

export default App;

let createPost = async function(titleInput:String,textInput:String,setPosts:any){
  const jwt = Cookies.get('jwt');
  const postObj = await fetch(`http://localhost:5000/api/post`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body:JSON.stringify({
        title: titleInput,
        text: textInput
      })
    }
  );
  await getPosts(setPosts);
};

let getPosts = async function(setPosts:any) {
  const jwt:any = Cookies.get('jwt');
  //send a request for all of the users post data
  try {
    const response = await fetch('http://localhost:5000/api/post/all', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
    });
    const jsonData = await response.json();
    const posts = jsonData.posts; // extract the posts array from the JSON data
    setPosts(posts);
  } catch(e) {
    console.log(`An error, ${e} has occured`);
  };
};