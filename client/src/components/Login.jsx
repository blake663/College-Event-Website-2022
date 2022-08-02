import { useState } from 'react';



const Login = ({ handleLogin }) => {

  const [ radioOption, setRadioOption ] = useState(1);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');

  function validateEmail(email) {
    // [ name, school ] = email.split('@');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log({radioOption, email, password});
    setError('');
    // include boolean superAdmin in the body
    if (radioOption==1) {
      try {
        const body = { email, password };
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const { loggedIn } = await res.json();
        console.log("boolean result", loggedIn);
        if (loggedIn == true) {
          handleLogin(email, password);
        } else {
          setTimeout(() => setError('*Invalid login'), 200);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    else if (radioOption==2) {
      try {
        const body = { email, password, superAdmin: false }
        const res = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        alert(result.createdAccount ? 'registered successfully' : result.error);
        console.log(result);
      } catch (err) {
        console.error(err.message);
      }
    } else { // radioOption==3
      try {
        const body = { email, password, superAdmin: true }
        const res = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        alert(result.createdAccount ? 'registered successfully' : result.error);
        console.log(result);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const handleRadioChange = (option) => {
    setRadioOption(option);
    setError('');
  }

  return (
    <>
      <div className='mx-auto mt-5' style={{width: "400px"}}>
        <h2>Create an account or Sign in</h2>
        <form>
          <div className="mb-3 mt-3">
            <label className="form-label">Email:</label>
            <input type="ggg" className="form-control" value={email} onChange={e => setEmail(e.target.value.toLocaleLowerCase())} placeholder="Enter university email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
          <div className="text-danger "><em>{error}</em></div>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" name="loginFormRadio" checked={radioOption==1} onChange={()=>handleRadioChange(1)} />Log In
            <label className="form-check-label" ></label>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" name="loginFormRadio" checked={radioOption==2} onChange={()=>handleRadioChange(2)} />Sign Up as student
            <label className="form-check-label" ></label>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" name="loginFormRadio" checked={radioOption==3} onChange={()=>handleRadioChange(3)} />Sign Up as super admin
            <label className="form-check-label" ></label>
          </div>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </>
  )
}

export default Login;