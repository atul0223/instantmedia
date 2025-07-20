import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Otp from "./pages/Otp.jsx";
import Emailverification from "./pages/Emailverification.jsx";
import ForgetPass from "./pages/ForgetPass.jsx";
import ChangePass from "./pages/ChangePass.jsx";



function App() {

  return (
  <>
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<Login />}></Route>
    <Route path="/Signup" element={<Signup/>}></Route>
   <Route path="/verifyotp" element={<Otp/>}></Route>
   <Route path="/verifyemail" element={<Emailverification/>}></Route>
   <Route path="/ForgotPassword" element={<ForgetPass/>}></Route>
  <Route path="/changePass" element={<ChangePass/>}></Route>

    </Routes>
   </BrowserRouter>
  
  </>
  )
}

export default App
