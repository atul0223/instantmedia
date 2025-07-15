import { useNavigate } from "react-router-dom";
export default function Signup() {
   const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="pl-50">
                <img src="/loginSideImage.png" alt="" />
        </div>
        <div className="   p-50 rounded-2xl ">
          <form action="">
            <div>
              <h4>Sign up</h4>
            </div>
            <div className="form-floating mb-3 mt-3">
              <input
                type="text"
                className="form-control"
                id="floatingUser"
                placeholder="Username"
              />
              <label htmlFor="floatingUser">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingFullName"
                placeholder="FullName"
              />
              <label htmlFor="floatingFullName">Full name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
              />
              <label htmlFor="floatingEmail">Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary" type="button">
                Sign up
              </button>
            </div>
            <div>
          <p className="text-sm pt-3 cursor-pointer">
            already have an account?
            <a
              className="text-blue-500"
              onClick={() => {
                navigate("/Login");
              }}
            >
              {" "}
              Click Here
            </a>
          </p>
        </div>
       
      </form>
 </div>
 </div>

  )
}
