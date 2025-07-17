import { Link } from "react-router-dom";

export default function Signup () {
  return (
    <div className='h-screen w-screen flex justify-center items-center '>
      <div className='flex justify-center w-full h-full  p-25 rounded-1xl bg-blue-100 pt-15'>
       
        <form action=''> <div className="mb-6  ml-2">
          <h2>!! Welcome !!</h2>
                  </div>
          <div className='form-floating mb-2 '>
            <input
              type='text'
              className='form-control'
              id='floatingUsername'
              placeholder='Username'
            />
            <label htmlFor='floatingUsername'>Username</label>
          </div>
          
           <div className='form-floating mb-2 '>
            <input
              type='text'
              className='form-control'
              id='floatingFullName'
              placeholder='Full name'
            />
            <label htmlFor='floatingFullName'>Full name</label>
          </div> <div className='form-floating mb-2 '>
            <input
              type='email'
              className='form-control'
              id='floatingEmil'
              placeholder='Email'
            />
            <label htmlFor='floatingEmail'>Email</label>
          </div>
          <div className='form-floating mb-2'>
            <input
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>Password</label>
          </div>
           <div className='form-floating mb-3'>
            <input
              type='password'
              className='form-control'
              id='floatingPassword'
              placeholder='Password'
            />
            <label htmlFor='floatingPassword'>confirm Password</label>
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
            <button className='btn btn-primary' type='button'>
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
