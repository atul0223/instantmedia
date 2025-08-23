import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Loading from "../component/Loading";

export default function Login() {
  const userref = useRef();
  const navigate = useNavigate();
  const passref = useRef();
  const trustref = useRef();
  const [message, setMessage] = useState("");
  const { loggedIn, setLoggedIn, loading, setLoading ,fetchCurrentUser} =
    useContext(UserContext);
  useEffect(() => {
    setLoading(false);
    if (loggedIn) navigate("/home");
  }, [loggedIn]);

  const login = async function () {
    setLoading(true);
    const username = userref.current?.value;
    const password = passref.current?.value;
    const trustDevice = trustref.current?.checked;
    const userData = { username, password, trustDevice };

    if (!username || !password) {
      setMessage("fields required");
    }

    await axios
      .post("https://localhost:3000/user/login", userData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.requiresOtp) {
          setLoading(false);
          localStorage.setItem("actualuser1", username);
           
          navigate("/verifyotp");
        } else {
          setMessage(response.data.message);
          setLoggedIn(true);
          setLoading(false);
          localStorage.setItem("actualuser1", username);
         
          navigate("/home");
        }
      })
      .catch((error) => {
        localStorage.setItem("actualuser1", username);
        setLoading(false);
        if (error.response) {
          if (error.response.data.requiresOtp) {
             
            navigate("/verifyotp");
          }
          if (error.response.data.message === "Please verify your email") {
            localStorage.setItem("username", `${username}`);
             
            navigate("/verifyemail");
          }

          setMessage(error.response.data.message);
        } else {
          setMessage("Something went wrong.");
        }
      });

    setLoading(false);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-blue-200">
      <Loading />
      <div className="flex justify-center w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 p-25 sm:rounded-4xl bg-blue-100 ">
        <div>
          <div className="mb-6 ">
            <h2>Welcome Back</h2>
          </div>

          <div className="form-floating mb-3 ">
            <input
              ref={userref}
              type="text"
              className="form-control"
              id="floatingUsername"
              placeholder="Username"
              required
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              required
              ref={passref}
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className=" flex justify-end items-center overflow-hidden mb-1">
            {message && <p className="text-red-800 text-sm m-0">{message}</p>}
          </div>

          <div className="form-check mb-3">
            <input
              required
              ref={trustref}
              className="form-check-input"
              type="checkbox"
              value=""
              id="checkDefault"
            />
            <label className="form-check-label" htmlFor="checkDefault">
              Trust on this device?
            </label>
          </div>
          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary" type="button " onClick={login}>
              Log in
            </button>
          </div>
          <div className="grid grid-cols-3">
            <hr />
            <p className="ml-6 pt-1">or</p>
            <hr />
          </div>
          <div className="sm:ml-10 ml-7">
            <Link to={"/ForgotPassword"}>Forgot password</Link>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <hr />
            <p className="ml-6 pt-1">or</p>
            <hr />
          </div>
          <div className="">
            <p>
              Don't have a account? <Link to={"/Signup"}>Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
