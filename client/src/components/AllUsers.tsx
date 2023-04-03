import React,{useState,useEffect} from 'react';
import Cookies from 'js-cookie';

export default function AllUsers(){
  const [currentUser,setCurrentUser] = useState();
  const [allUsers,setAllUsers] = useState([]);
  useEffect(()=>{
    getUsers(currentUser,setCurrentUser,setAllUsers);
  },[])
  return(
    <div className='all-users-container'>
      {
        allUsers.map((i:any)=>{
          return(
            <div className='user' key={Math.random()}>
                <div>First Name: {i.firstName}</div>
                <div>Last Name: {i.lastName}</div>
                <div>Age: {i.age}</div>
                {renderFriendButton(i,currentUser)}
            </div>
          )
        })
      }
    </div>
  )
}
let getUsers = async function(currentUser:any,setCurrentUser:any,setAllUsers:any){
  const jwt:any = Cookies.get('jwt');
  //get currently signed in user info
  try{
    const response = await fetch('http://localhost:5000/api/login/', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    const jsonData = await response.json();
    setCurrentUser(jsonData.user);
  }catch(e){
    console.log(`An error, ${e} has occured when getting currently signed in user data`);
  }
  //get all user info
  try {
    const response = await fetch('http://localhost:5000/api/user/all', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    const jsonData = await response.json();
    setAllUsers(jsonData.allUsers);
  } catch(e) {
    console.log(`An error, ${e} has occured when getting all user data`);
  };
};

let renderFriendButton = function(user:any, currentUser:any) {
  if (!user || !currentUser) {
    return(<div></div>);//returns empty div if there is no userr
  } else if (user.friendRequests.includes(currentUser._id)) {
    return (<div>Pending</div>);//if a friend request is pending display "pending"
  } else if (currentUser.friendRequests.includes(user._id)){
    return (<div onClick={()=>{acceptUser(user,currentUser)}}>Accept</div>);//if the user has requested the current user display "accept"
  }else if (user._id === currentUser._id) {
    return (<div>You</div>);//if the user is the current user show "you"
  } else if (user.friends.includes(currentUser._id)) {
    return (<div>Friends</div>);//if the user is already a friend display "friends"
  } else {//if the user is not a friend display "send friend request"
    return (<div onClick={()=>{requestUser(user,currentUser)}}>Add User</div>);
  };
};

let acceptUser = async function(user:any, currentUser:any){
  const jwt:any = Cookies.get('jwt');
  //get currently signed in user info
  try{
    const response = await fetch(`http://localhost:5000/api/user/${user._id}/accept`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
  }catch(e){
    console.log(`An error, ${e} has occured when accepting a friend request from user ${user._id}`);
  }
};
let requestUser = async function(user:any, currentUser:any){
  const jwt:any = Cookies.get('jwt');
  //get currently signed in user info
  try{
    const response = await fetch(`http://localhost:5000/api/user/${user._id}/request`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
  }catch(e){
    console.log(`An error, ${e} has occured when sending a friend request to user ${user._id}`);
  }
};