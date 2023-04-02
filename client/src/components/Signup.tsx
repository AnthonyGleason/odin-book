import React, {useState} from 'react';
import '../styles/signup.css';

function App() {
  const [firstNameInput,setFirstNameInput] = useState('');
  const [lastNameInput,setLastNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('0');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordConfirmInput, setPasswordConfirmInput] = useState('');
  
  return (
    <div className="signup">
      <form method='POST' action='http://localhost:5000/api/signup'>
        <div>
          <label htmlFor='firstName'>First Name: </label>
          <input id='firstName' name='firstName' type='text' value={firstNameInput} onChange={(e)=>{setFirstNameInput(e.target.value)}} />
        </div>
        <div>
          <label htmlFor='lastName'>Last Name: </label>
          <input id='lastname' name='lastName' type='text'  value={lastNameInput} onChange={(e)=>{setLastNameInput(e.target.value)}} />
        </div>
        <div>
          <label htmlFor='age'>Age: </label>
          <input id='age' name= 'age' type='number' value={ageInput} onChange={(e)=>{setAgeInput(e.target.value)}} />
        </div>
        <div>
          <label>Email: </label>
          <input id='email' name= 'email' type='email' value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}} />
        </div>
        <div>
          <label>Password: </label>
          <input id='password' name= 'password' type='password' value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}} />
        </div>
        <div>
          <label>Confirm Password: </label>
          <input id='passwordConfirm' name= 'passwordConfirm' type='password' value={passwordConfirmInput} onChange={(e)=>{setPasswordConfirmInput(e.target.value)}} />
        </div>
        <button type='submit'>Sign up!</button>
      </form>
    </div>
  );
};
export default App;