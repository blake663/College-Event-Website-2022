import { Fragment, useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';



const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};


function App() {

  const [ email, setEmail ] = useLocalStorage('CEW-email', '');
  const [ password, setPassword ] = useLocalStorage('CEW-password', '');
  const [ loggedIn, setLoggedIn ] = useLocalStorage('CEW-is-logged-in', false);

  const handleLogin = (suppliedEmail, suppliedPassword) => {
    setEmail(suppliedEmail);
    setPassword(suppliedPassword);
    setLoggedIn(true);
  }

  const handleLogOut = () => {
    setEmail('');
    setPassword('');
    setLoggedIn(false);
  }
  

  //could pass email as prop to go with the logout button in the navbar
  return (
    <div className="container-fluid">
      {
        loggedIn
          ?
        <Dashboard email={email} handleLogOut={handleLogOut}/>
          :
        <Login handleLogin={handleLogin}/>
      }
    </div>
  );
}

export default App;
