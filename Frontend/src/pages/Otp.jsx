import { useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Otp () {
  const navigate =useNavigate()
  const otpref = useRef()
 const [message,setMessage]=useState("")
  const otpverify = async function () {
   

    const otp = otpref.current?.value
   
    const userotp = {otp }
    console.log(userotp);
   
    const res =await axios.post('https://localhost:3000/user/verifyotp', userotp, {
  withCredentials: true,
}).then((response) => {
   setLoggedIn(true)
        setCurrentUsername(username)
         navigate("/home")
        console.log(response.data);
        
      })
      .catch((error) => { 
       
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Something went wrong.');
        }
      });

    }
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-blue-200'>
      <div className='flex justify-center w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 p-30 sm:mb-30 sm:pt-12 sm:pb-20 sm:rounded-4xl bg-blue-100 '>
        <div>
          
          <div className='mb-6 ' id='123'>
            <h6 >please verify otp sent to registerd email !!</h6>
          </div>
          
          <div className='form-floating mb-3 '>
            <input
              ref={otpref}
              type='number'
              className='form-control'
              id='floatingOtp'
              placeholder='Otp'
            />
            <label htmlFor='floatingOtp'>Otp</label>
          </div>
         <div className=" flex justify-end items-center overflow-hidden mb-2">
            {message && <p className="text-red-800 text-sm m-0">{message}</p>}
          </div>
          <div className='d-grid gap-2 mb-4'>
            <button className='btn btn-primary' type='button ' onClick={otpverify}>
             verify
            </button>
          </div>
         
         
          <div className='grid grid-cols-3 mt-3'>
            <hr />
            <p className='ml-6 pt-1'>or</p>
            <hr />
          </div>
          <div className='sm:ml-11'>
            <p>
              Don't have a account? <Link to={'/Signup'}>Signup</Link>
            </p>
          </div>
          
       </div>
      </div>
    </div>
  )
}
