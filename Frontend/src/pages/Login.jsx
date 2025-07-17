import { useRef, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login () {
  const userref = useRef()
  const navigate =useNavigate()
  const passref = useRef()
  const trustref = useRef()
  const [message,setMessage]= useState("")
  const login = async function () {
   

    const username = userref.current?.value
    const password = passref.current?.value
    const trustDevice= trustref.current?.checked
    const userData = { username, password,trustDevice }
    
    
   const res =await axios.post('https://localhost:3000/user/login', userData ,{withCredentials:true})


  if (res.data.requiresOtp) {
  navigate("/verifyotp");
} else {
  
  setMessage(res.data.message)
}

    
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center '>
      <div className='flex justify-center w-full h-full  p-25 rounded-1xl bg-blue-100 '>
        <div>
          
          <div className='mb-6 '>
            <h2>Welcome Back</h2>
          </div>
          <div>
          <h6> {message && <p className="text-green-800">{"️✅"+message}</p>}</h6> 

          </div>
          <div className='form-floating mb-3 '>
            <input
              ref={userref}
              type='text'
              className='form-control'
              id='floatingUsername'
              placeholder='Username'
            />
            <label htmlFor='floatingUsername'>Username</label>
          </div>
          <div className='form-floating mb-3'>
            <input
              ref={passref}
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
          <div className='form-check mb-3'>
            <input
              ref={trustref}
              className='form-check-input'
              type='checkbox'
              value=''
              id='checkDefault'
            />
            <label className='form-check-label' htmlFor='checkDefault'>
              Trust on this device?
            </label>
          </div>
          <div className='d-grid gap-2 mb-4'>
            <button className='btn btn-primary' type='button ' onClick={login}>
              Log in
            </button>
          </div>
          <div className='grid grid-cols-3'>
            <hr />
            <p className='ml-6 pt-1'>or</p>
            <hr />
          </div>
          <div className='sm:ml-10 ml-7'>
            <a href='/'>Forgot password</a>
          </div>
          <div className='grid grid-cols-3 mt-3'>
            <hr />
            <p className='ml-6 pt-1'>or</p>
            <hr />
          </div>
          <div className=''>
            <p>
              Don't have a account? <Link to={'/Signup'}>Signup</Link>
            </p>
          </div>
          
       </div>
      </div>
    </div>
  )
}
