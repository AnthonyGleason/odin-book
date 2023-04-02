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
          posts.map((i)=>{
            return(
              <div>
                test
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
        <button type='button' onClick={()=>{createPost(titleInput,textInput)}} >Create Post</button>
      </form>
    </div>
  );
}

export default App;

let createPost = async function(titleInput:String,textInput:String){
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
};

let getPosts = async function(setPosts:any) {
  
};
