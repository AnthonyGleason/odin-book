import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

//import route components
import Login from './components/Login';
import Timeline from './components/Timeline';
import Signup from './components/Signup';
import User from './components/User';
import Post from './components/Post';
import Profile from './components/Profile';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Timeline />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />} />
        <Route path='/user/:userID' element={<User />} />
        <Route path='/posts/:postID' element={<Post />} />
        <Route path='/timeline' element={<Timeline />}/>
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
