import React, {useState} from 'react';
import '../styles/login.css';

function App() {
  const [emailInput,setEmailInput] = useState('')
  const [passwordInput,setPasswordInput] = useState('');
  return (
    <div className="login">
      <form method='POST' action='http://localhost:5000/api/login'>
        <div>
          <label htmlFor='email'>Email: </label>
          <input id='email' type='email' name='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}}/>
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input id='password' type='password' name='password' value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
        </div>
        <button type='submit'>Log in!</button>
      </form>
    </div>
  );
}

export default App;