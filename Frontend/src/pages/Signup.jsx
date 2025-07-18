import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { BACKENDURL } from "../config";
export default function Signup () {
  const [pass,setPass]=useState("")
  const userref=useRef()
  const passref=useRef()
  const fullNameref=useRef()
  const emailref=useRef()
  const navigate =useNavigate()
  const signup=async function(){
    const username=userref.current.value
    const password =passref.current.value
    const fullName=fullNameref.current.value
    const email=emailref.current.value
    const userData ={
      username,
      password,
      fullName,
      email
    }

    const res =await axios.post(`${BACKENDURL}/user/signup`,userData,{withCredentials:true})
    localStorage.setItem('username', `${username}`) 
     navigate(`/verifyemail`)
    console.log(res);
    
  }
  return (
    
    <div className='h-screen w-screen flex justify-center items-center bg-blue-200 '>
      <div className='flex justify-center w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 p-25 sm:pt-12 sm:pb-12 sm:rounded-4xl bg-blue-100 '>
       
        <form action=''> <div className="mb-6  ml-2 ">
          <h2>!! Welcome !!</h2>
                  </div>
          <div className='form-floating mb-2'>
            <input
            ref={userref}
              type='text'
              className='form-control'
              id='floatingUsername'
              placeholder='Username'
            />
            <label htmlFor='floatingUsername'>Username</label>
          </div>
          
           <div className='form-floating mb-2 '>
            <input
            ref={fullNameref}
              type='text'
              className='form-control'
              id='floatingFullName'
              placeholder='Full name'
            />
            <label htmlFor='floatingFullName'>Full name</label>
          </div> <div className='form-floating mb-2 '>
            <input
            ref={emailref}
              type='email'
              className='form-control'
              id='floatingEmil'
              placeholder='Email'
            />
            <label htmlFor='floatingEmail'>Email</label>
          </div>
          <div className='form-floating mb-2'>
            <input
            ref={passref}
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
           <div className='form-floating mb-3'>
            <input
              value={pass}
              onChange={ (e)=>{ setPass(e.target.value)}}
              type='text'
              className='form-control'
              id='floatingPasswordconfirm'
              placeholder='Confirm Password'
            />
            <label htmlFor='floatingPasswordconfirm'>Confirm password</label>
          </div>
          <div className='form-check mb-3'>
            <input
              className='form-check-input'
              type='checkbox'
              value=''
              id='checkDefault'
            />
            <label className='form-check-label' htmlFor='checkDefault'>
              Accept our terms? 
            </label>
          </div>
          <div className='d-grid gap-2 mb-3'>
            <button className='btn btn-primary' type='button'onClick={signup}>
              Sign up
            </button>
          </div>
          
         
           
          <div className="grid grid-cols-3 mt-3"><hr />
            <p className="ml-6 pt-1">or</p>
            <hr />
          </div>
          <div className="">
            <p>Already have a account? <Link to={"/"}>Login</Link></p>
            
          </div>
        </form>
      </div>
    </div>
  )
}
