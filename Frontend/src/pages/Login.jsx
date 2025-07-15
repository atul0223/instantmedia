import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./signup";
import axios from 'axios'
export default function Login() {
   const useref = useRef();
  const passref = useRef();
 const trustref =useRef()
   const navigate = useNavigate();
   async function login() {
    
    const username = useref.current?.value;
    const password = passref.current?.value;
    const trustDevice =trustref.current?.checked
    const userData = {
      username,
      password,
      trustDevice
    };
    console.log(userData);
    
    const response = await axios.post("http://localhost:3000/user/login", userData);
    const jwt = response.data.token;
    localStorage.setItem("token", jwt);
    navigate("/dashboard");
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="pl-50">
                <img src="/loginSideImage.png" alt="" />
        </div>
        <div className="   p-50 rounded-2xl ">
          <form action="">
            <div>
              <h4>Login</h4>
            </div>
            <div className="form-floating mb-3">
              <input ref={useref}
                type="text"
                className="form-control"
                id="floatingUser"
                placeholder="Username"
              />
              <label htmlFor="floatingUser">Username</label>
            </div>
            
            <div className="form-floating mb-3">
              <input ref={passref}
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-check mt-3">
              <input ref={trustref}
                className="form-check-input"
                type="checkbox"
                value=""
                id="checkDefault"
              />
              <label className="form-check-label" htmlFor="checkDefault">
                Trust on this device
              </label>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary" type="button" onClick={login}>
                log in
              </button>
            </div>
            <div>
          <p className="text-sm pt-3 cursor-pointer">
            Don't have an account?
            <a
              className="text-blue-500"
              onClick={() => {
                navigate("/Signup");
              }}
            >
              {" "}
              Click Here
            </a>
          </p>
        </div>
        <div className="flex justify-center pt-4">
          <button
            
            variant="primary"
            text="Signin"
            
          />
        </div>
      </form>
 </div>
 </div>

  )
}
