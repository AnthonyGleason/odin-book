import React, {useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import '../styles/timeline.css';

function App() {
  const [posts,setPosts] = useState([]);

  const [titleInput,setTitleInput] = useState('');
  const [textInput, setTextInput] = useState('');

  useEffect(()=>{
    getPosts(setPosts);
  },[])

  return (
    <div className="timeline">
      <div className='posts-container'>
        {
          posts.map((i:any)=>{
            return(
              <div className='post' key={Math.random()}>
                <div>Title: {i.title}</div>
                <div>Text: {i.text}</div>
                <div>Date Created: {i.dateCreated}</div>
                <div>Author: {i.author}</div>
              </div>
            )
          })
        }
      </div>
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
    </div>
  );
};

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
  getPosts(setPosts);
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