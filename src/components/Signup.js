import React ,{useState} from "react";
import { useHistory } from "react-router-dom";

const Signup = (props) => {

    const [credentials, setCredentials] = useState({name:"", email: "" , password: "",cpassword:""})
    let history = useHistory();
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password,cpassword} = credentials;
        if(password===cpassword){

            const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name , email , password})
            });
            const json = await response.json();
            //   console.log(json); 
            if(json.success===true){
                // Save the auth token and redirect
                localStorage.setItem('token',json.authtoken);
                history.push('/');
                props.showAlert('Account created successfully','success');
            }
            else{
                props.showAlert('Invalid Details','danger');
            }
        }
        else{
            props.showAlert("Your passwords entries doesn't match!!",'danger');
        }
        }

    const onChange = (e) => {
        setCredentials({...credentials,[e.target.name]:e.target.value})
      };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <h2 className="my-1">Create an account to iNotebook</h2>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
           Name
          </label>
          <input
            type="text"
            className="form-control"
            onChange={onChange}
            id="name"
            name="name"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
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
            className="form-control"
            required
            minLength={5}
            id="password"
            name="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            onChange={onChange}
            className="form-control"
            required
            minLength={5}
            id="cpassword"
            name="cpassword"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
