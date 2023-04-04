import '../styles/profile.css';
import React, {useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

function App() {
  const [currentUserID,setCurrentUserID] = useState(useParams().userID);
  const [currentTab,setCurrentTab] = useState('posts')
  //content states
  const [userData,setUserData] = useState();
  //load getPosts because it is the default tab when first going onto a user's page
  useEffect(()=>{
    async function fetchData() {
      const user = await getUser(currentUserID);
      setUserData(user);
    }
    fetchData();
    switch(currentTab){
      case 'posts':
        break;
      case 'comments':
        break;
      case 'likes':
        break;
      case 'shares':
        break;
    }
  },[currentTab,currentUserID])

  return (
    <div className="profile">
      <ul className='user-nav'>
        <li onClick={()=>{setCurrentTab('posts')}}>Posts</li>
        <li onClick={()=>{setCurrentTab('comments')}}>Comments</li>
        <li onClick={()=>{setCurrentTab('likes')}}>Likes</li>
        <li onClick={()=>{setCurrentTab('shares')}}>Shares</li>
      </ul>
      <div className='content-container'>
        <div>{currentTab}</div>
      </div>
    </div>
  );
}

export default App;

let getUser = async function(currentUserID:any) {
  const jwt:any = Cookies.get('jwt');
  //send a request for all of the users post data
  try {
    const response = await fetch(`http://localhost:5000/api/user/${currentUserID}/data`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    const jsonData = await response.json();
    const user= jsonData.user; // extract the user data from the JSON data
    console.log(user);
    return user;
  } catch(e) {
    console.log(`An error, ${e} has occured`);
    return null;
  };
};