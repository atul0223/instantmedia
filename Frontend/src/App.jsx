import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
function App() {
  
  return (
  <>
   <BrowserRouter>
   <Routes>
   <Route path="/Login" element={<Login />}></Route>
    <Route path="/Signup" element={<Signup />}></Route>
    </Routes>
   </BrowserRouter>
  
  </>
  )
}

export default App
