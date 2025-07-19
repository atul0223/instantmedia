import axios from "axios"
import { useRef } from "react"
import { BACKENDURL } from "../config"
import { useState } from "react"
import { Link } from "react-router-dom"
export default function ForgetPass() {
    const [message, setMessage] = useState("");
    const emailref =useRef()
    const forget =async ()=>{
        const email=emailref.current?.value
        const userData ={
            email
        }
       const res = await axios.post(`${BACKENDURL}/user/forgetPassword`,userData,{withCredentials:true}).then((response)=>{
            setMessage(response.data.message);
        }).catch((error)=>{
            if (error.response) {
                
                setMessage(error.response.data.message);
            } else if (error.request) {
                
                setMessage("No response from server. Please try again later.");
            } else {
                
                setMessage("Error: " + error.message);
            }
        })
      
        
        
    }
  return (
       <div className='h-screen w-screen flex justify-center items-center bg-blue-200 '>
      <div className='flex justify-center w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 p-25 sm:pt-12 sm:pb-12 sm:rounded-4xl bg-blue-100 '>
       <div>
          <div className="mb-6 ">
            <h3>Forgot Password ?</h3>
          </div>

          <div className="form-floating mb-3 ">
            <input
              ref={emailref}
              type="email"
              className="form-control"
              id="floatingUsername"
              placeholder="Email"
              required
            />
            <label htmlFor="floatingEmail">registered email?</label>
          </div>
          <div className=" flex justify-end items-center overflow-hidden mb-3">
            {message && <p className="text-red-800 text-sm m-0">{message}</p>}
          </div>

           <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary" type="button " onClick={forget}>
              Submit
            </button>
          </div>
          <div className="grid grid-cols-3 mt-3">
            <hr />
            <p className="ml-6 pt-1">or</p>
            <hr />
          </div>
          <div className="sm:ml-8">
            <p>
              Don't have a account? <Link to={"/Signup"}>Signup</Link>
            </p>
          </div>
      
       </div>
    </div>
    </div>
  )
}
