import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Otp from "./pages/Otp.jsx";

function App() {
  
  return (
  <>
   <BrowserRouter>
   <Routes>
   <Route path="/" element={<Login />}></Route>
    <Route path="/Signup" element={<Signup/>}></Route>
   <Route path="/verifyotp" element={<Otp/>}></Route>
    </Routes>
   </BrowserRouter>
  
  </>
  )
}

export default App
