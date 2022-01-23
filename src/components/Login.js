import React ,{useState} from "react";
import { useHistory } from "react-router-dom";

const Login = (props) => {
    
    const [credentials, setCredentials] = useState({email: "" , password: ""})
    let history = useHistory();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({email:credentials.email , password: credentials.password})
          });
          const json = await response.json();
        //   console.log(json); 
        if(json.success===true){
            // Save the auth token and redirect
            localStorage.setItem('token',json.authtoken);
            history.push('/');
            props.showAlert('Logged in successfully','success');
        } 
        else{
           props.showAlert('Invalid Credentials!','danger')
        }
        }

        const onChange = (e) => {
          setCredentials({...credentials,[e.target.name]:e.target.value})
        };

  return (
    <div className="container mt-1">
      <form onSubmit={handleSubmit}>
          <h2 className="my-2">Login for some iNotebooking </h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            onChange={onChange}
            value={credentials.password}
            className="form-control"
            id="password"
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
