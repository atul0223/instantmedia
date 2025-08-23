import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Otp from "./pages/Otp.jsx";
import Emailverification from "./pages/Emailverification.jsx";
import ForgetPass from "./pages/ForgetPass.jsx";
import ChangePass from "./pages/ChangePass.jsx";
import Profile from "./pages/Profile.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import HomePage from "./pages/HomePage.jsx";
import AddPost from "./pages/AddPost.jsx";
import Settings from "./pages/Settings.jsx";
import Chat from "./pages/Chat.jsx";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Signup" element={<Signup />}></Route>
          <Route path="/verifyotp" element={<Otp />}></Route>
          <Route path="/verifyemail" element={<Emailverification />}></Route>
          <Route path="/ForgotPassword" element={<ForgetPass />}></Route>
          <Route path="/changePass" element={<ChangePass />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/upload" element={<AddPost />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
           <Route path="/chat" element={<Chat />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
