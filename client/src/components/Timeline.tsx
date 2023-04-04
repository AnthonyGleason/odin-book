import React, {useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import '../styles/timeline.css';

function App() {
  const [timelineShares,setTimelineShares] = useState([]);
  const [timelinePosts,setTimelinePosts] = useState([]);
  useEffect(()=>{
    getTimeline(setTimelineShares,setTimelinePosts);
  },[])
  return (
    <div className="timeline">
      {
        timelinePosts.map((i:any)=>{
          return(
            <div className='post' key={Math.random()}>
              <div>Post Title: {i.title}</div>
              <div>Post Text: {i.text}</div>
            </div>
          )
        })
      }
      {
        timelineShares.map((i:any)=>{
          return(
            <div className='shares' key={Math.random()}>
              <div>Post Title: {i.share.title}</div>
              <div>Post Text: {i.share.text}</div>
              <div>Date Created: {i.share.dateCreated}</div>
              <div>Post Author:</div>
              <div>Shared By: {`${i.friend.firstName} ${i.friend.lastName}`}</div>
            </div>
          )
        })
      }
    </div>
  );
};

export default App;
//show posts in a left column and shares in a right column

let getTimeline = async function(setTimelineShares:any,setTimelinePosts:any){
  const jwt = Cookies.get('jwt');
  const response = await fetch(`http://localhost:5000/api/user/timeline`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
    }
  );
  let jsonData = await response.json();
  console.log(jsonData);
  setTimelineShares(jsonData.shares);
  setTimelinePosts(jsonData.posts);
};