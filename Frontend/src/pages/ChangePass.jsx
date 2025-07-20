import axios from "axios"

import { useState ,useEffect} from "react"
import { BACKENDURL } from "../config"
import { useNavigate } from "react-router-dom"

export default function ChangePass() {
const [message,setMessage] =useState("")
const [pass,setPass] =useState("")
const [con,setCon] =useState("")
const[dis,setDis] =useState(true)
const [tokenz,setTokenz]=useState("")
const [validUrl,setValidUrl]=useState(false)
const navigate = useNavigate();
useEffect(() => {
  const verifyToken = async () => {
    const token = new URLSearchParams(window.location.search).get("token");
    try {
      const response = await axios.get(`${BACKENDURL}/user/jwtverify/${token}`);
      if (response.data.valid) { // small typo fix: "vadid" → "valid"
        setValidUrl(true);
        setTokenz(response.data.token);
      }
    } catch (err) {
      console.error(err);
      setValidUrl(false);
    }
  };
  verifyToken();
}, []);

if(validUrl){
  const changePass =async()=>{
   await axios.post(`${BACKENDURL}/user/changePass/${tokenz}`, { newPassword: pass }).then((response) => {
      if (response.status === 200) {
        setMessage("Password changed successfully");
        setPass("");
        setCon("");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage("Failed to change password");
      }
    }).catch((error) => {
      console.error("Error changing password:", error);
      setMessage("Error changing password");
    }

    )
  }
  return (
     <div className="h-screen w-screen flex justify-center items-center bg-blue-200">
      <div className="w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 sm:p-20 p-20 sm:rounded-4xl bg-blue-100">
        <div> 
             <div className="form-floating mb-2">
            <input
              required
             
              value={pass}
              onChange={(e)=>{
                  setPass(e.target.value)
                  if (e.target.value.length!==0 ) {
                    
                     if (e.target.value!==con) {
                       
                        setMessage("");
                       setDis(true)
                    }
                    else{ setMessage(""); setDis(false)}
                  }
                  else{
                   setMessage("Empty password")
                  }
              }}    
              type="password"
              className="form-control"
              id="floatingPassword1"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword1">New password</label>
          </div>
         
           <div className="form-floating mb-1 ">
            <input
              required
              
               onChange={(e)=>{
                  setCon(e.target.value)
                   
                  if (e.target.value.length!==0) {
                    if (e.target.value!==pass) {
                      setMessage("Password mismatch")
                      setDis(true)
                    }
                    else{ setMessage("")
                      setDis(false)
                    }
                    
                  }
                  else{
                   setMessage("Please confirm password")
                  }
                  
              }} 
              type="password"
              className="form-control"
              id="floatingPassword2"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword2">Confirm password</label>
          </div>
          <div className=" flex justify-end items-center overflow-hidden mb-1">
            {message && <p className="text-red-800 text-sm m-0">{message}</p>}
          </div>
        
          </div>
          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary" type="button " onClick={changePass} disabled={dis}>
              Update
            </button>
          </div>
        </div>
      </div>
    
  )
}
else{
  return (
     <div className="h-screen w-screen flex justify-center items-center bg-blue-200">
      <div className="w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 sm:p-20 p-20 sm:rounded-4xl bg-blue-100">
        <div> 
    <h3>invalid or broken url</h3>
    </div></div></div>
  )
}
}
