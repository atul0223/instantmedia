import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { BACKENDURL } from "../config.js";
import { Link,useNavigate } from "react-router-dom";
import Loading from "../component/Loading.jsx";



function Settings() {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const[btnDisabled,setBtnDisabled]=useState(false)
  const[message,setMessage] =useState("")
  const navigate = useNavigate();
  const handleLogout = async() => {
     setLoading(true);
    try {
      const response = await axios.get(
        `${BACKENDURL}/user/logout`,
        
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error changing username");
    } finally {
      setLoading(false);
    }
  }
  const handleChangeUsername = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/user/updateUsername`,
        { newUsername },
        { withCredentials: true }
      );
      
      setMessage("Username updated successfully");
      setNewUsername("");
      fetchCurrentUser();
    } catch (error) {
      console.error("Error changing username:", error);
      setMessage(error.response?.data?.message || "Error changing username");
    } finally {
      setLoading(false);
    }

  };
  const handleFullNameChange = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/user/changeFullName`,
        { newFullName: newFullName },
        { withCredentials: true }
      );
      setMessage("Full name updated successfully");
      setNewFullName("");
      fetchCurrentUser();
    } catch (error) {
      console.error("Error changing full name:", error);
      setMessage(error.response?.data?.message || "Error changing full name");
    } finally {
      setLoading(false);
    }
  };
  const handleEmailChange = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/user/changeEmail`,
        { newEmail: newEmail },
        { withCredentials: true }
      );
   
      
      setMessage(response.data.message);
      setNewEmail("");
      fetchCurrentUser();
    } catch (error) {
      console.error("Error changing email:", error);
      setMessage(error.response?.data?.message || "Error changing email");
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/user/changePassword`,
        { newPassword: newPassword },
        { withCredentials: true }
      );
      setMessage("Password updated successfully");
      setNewPassword("");
      fetchCurrentUser();
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(error.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckUserAvailability = async (username) => {
    try {
      const res = await axios.get(`${BACKENDURL}/user/isUsernameAvailable/${username}`, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      if (!res.data.available) {
        setBtnDisabled(true);
      }
      else {
        setBtnDisabled(false);
      }
    } catch (error) {
      
    }
  };
  const handleProfileVisiblity =async()=>{
    setLoading(true)
    try {
      await axios.post(`${BACKENDURL}/user/toggleProfileVisiblity`,{makePrivate:!currentUserDetails.profilePrivate}, {
        withCredentials: true,
      });
      fetchCurrentUser();
    } catch (error) {
    
    }
  
    setLoading(false)
  
 }
  const { actualuser1,setLoading } = useContext(UserContext);
  const [selectedPic, setSelectedPic] = useState();
  const fileInputRef = useRef(null);
    const handlePickPhoto = () => {
    fileInputRef.current.click();
  };
  const handleDeleteProfilePic = async () => {
    setLoading(true)
    try {
      await axios.delete(`${BACKENDURL}/user/deleteProfilePic`, {
        withCredentials: true,
      });
      fetchCurrentUser();
    } catch (error) {
      
    }
    setIsOpen1(false)
    setLoading(false)
  };
  const handleFileChange = async(e) => {
    setLoading(true)
    const file = e.target.files[0];
    if (file) {
      setSelectedPic(file);
      try {
      
      setLoading(true);
  

    const formData = new FormData();
    formData.append("newProfilePic", file);
      const res =await axios.post(`${BACKENDURL}/user/changeProfilePic`,formData, {
        withCredentials: true,
      });
      fetchCurrentUser();
      
      
    } catch (error) {
   
    }
    setIsOpen1(false)
      setLoading(false)
    }
  };

  const { fetchCurrentUser, currentUserDetails } = useContext(UserContext);
  useEffect(() => {
    fetchCurrentUser();
    setNewUsername(currentUserDetails.username || "");
    setNewFullName(currentUserDetails.fullName || "");
    setNewEmail(currentUserDetails.email || "");
  }, []);
  return (
    <div className="w-screen min-h-screen bg-gray-700 sm:pl-30 sm:pr-30 pl-4 pr-4 flex justify-center">
      <Loading/>
      <div className="w-full h-full pb-3">
        <div className="w-full h-full mt-15 font-serif text-blue-200 ">
          
          <div>
            <div className="  w-full h-full flex justify-center   ">
              <div className="w-full h-6 flex justify-center mb-2">
                <img
                  src={currentUserDetails.profilePic}
                  
                  className="object-cover w-45 h-45 rounded-full absolute"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src ="pic.jpg"
                      
                  }}
                />

                <div>
                  
                  {isOpen1 ? (
                    <div className="ml-45 mt-30">
                      <img
                        src="close.png"
                        alt=""
                        className="absolute w-4 h-4 hover:w-5 hover:h-5 active:w-3 active:h-3  mt-4  "
                        onClick={() => {
                          setIsOpen1(!isOpen1);
                        }}
                      />
                      <img
                        src="delete.png"
                        alt=""
                        className="absolute w-6 h-6 hover:w-7 hover:h-7 active:w-5 active:h-5 z-10  ml-9 mb-9 "
                        onClick={() => {
                          setIsOpen1(!isOpen1);
                          handleDeleteProfilePic();
                        }}
                      />
                      <div onClick={handlePickPhoto}>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          
                          style={{ display: "none" }}
                        />
                        <img
                          src="edit.png"
                          alt=""
                          className="absolute w-5 h-5 hover:w-6 hover:h-6 active:w-4 active:h-4 z-10 ml-10 mt-9"
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      src="edit.png"
                      alt=""
                      className="absolute w-5 h-5 z-10 hover:w-4 hover:h-4 ml-23  mt-36 "
                      onClick={() => {
                        setIsOpen1(!isOpen1);
                      }}
                    />
                  )}
                </div>
                </div>
            </div>
            <div className="w-full h-full mt-43">
              <div className="w-full mb-5 ">
                 <div className="flex justify-center mb-1 mr-3"><h5>@ {currentUserDetails.username}</h5></div>
                 <div className="flex justify-center "><h5>{"("}{currentUserDetails.fullName}{")"}</h5></div> 
              </div>
              <div className="bg-gray-800 text-white rounded-2xl mb-1">
                <div
                  className="w-full h-20 p-4 items-center  cursor-pointer "
                  onClick={() => {
                    setIsOpen2(!isOpen2);
                  }}
                >
                  Change username
                </div>

                <div
                  className={`  pl-4 pr-4 pb-4 transition-all duration-300 ${
                    isOpen2
                      ? "max-h-96 opacity-100 block"
                      : "max-h-0 opacity-0 overflow-hidden hidden"
                  }`}
                >
                 
                  <div className="input-group">
                    <div className="w-full flex justify-end">{message}</div>
  <input type="text" className="form-control" placeholder="New username" aria-label="new username" aria-describedby="button-addon2" autoFocus onChange={(e) => { setNewUsername(e.target.value); handleCheckUserAvailability(e.target.value); }} value={newUsername}/>
  <button className="btn btn-primary" type="button" id="button-addon2" disabled={btnDisabled} onClick={handleChangeUsername}>Update</button>
</div>
                </div>
              </div>
              <div className="bg-gray-800 text-white rounded-2xl mb-1">
                <div
                  className="w-full h-20 p-4 items-center  cursor-pointer"
                  onClick={() => {
                    setIsOpen3(!isOpen3);
                  }}
                >
                  Change Full Name
                </div>

                <div
                  className={`  pl-4 pr-4 pb-4  transition-all duration-300 ${
                    isOpen3
                      ? "max-h-96 opacity-100 block"
                      : "max-h-0 opacity-0 overflow-hidden hidden"
                  }`}
                >
                  <div className="input-group">
  <input type="text" className="form-control" placeholder="New Fullname" aria-label="New Full Name" aria-describedby="button-addon3" autoFocus value={newFullName} onChange={(e) => setNewFullName(e.target.value)}/>
  <button className="btn btn-primary" type="button" id="button-addon3" onClick={handleFullNameChange}>Update</button>
</div>
                </div>
              </div>
              <div className="bg-gray-800 text-white rounded-2xl mb-1">
                <div
                  className="w-full h-20 p-4 items-center  cursor-pointer"
                  onClick={() => {
                    setIsOpen4(!isOpen4);
                  }}
                >
                  Change Email
                </div>

                <div
                  className={`pl-4 pr-4 pb-4 transition-all duration-300 ${
                    isOpen4
                      ? "max-h-96 opacity-100 block"
                      : "max-h-0 opacity-0 overflow-hidden hidden"
                  }`}
                >
                  <div className="input-group">
                    <div className="w-full flex justify-end">{message}</div>
  <input type="email" className="form-control" placeholder="New email" aria-label="New Email" aria-describedby="button-addon4" autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
  <button className="btn btn-primary" type="button" id="button-addon4" onClick={handleEmailChange}>Update</button>
</div>
                </div>
              </div>
              <div className="bg-gray-800 text-white rounded-2xl mb-1">
                <div
                  className="w-full h-20 p-4 items-center  cursor-pointer"
                  onClick={() => {
                    setIsOpen5(!isOpen5);
                  }}
                >
                  Change Password
                </div>

                <div
                  className={`pl-4 pr-4 pb-4 transition-all duration-300 ${
                    isOpen5
                      ? "max-h-96 opacity-100 block"
                      : "max-h-0 opacity-0 overflow-hidden hidden"
                  }`}
                >

                  <div className="input-group mb-2">
  <input type="password" className="form-control" placeholder="New Password" aria-label="New Password" aria-describedby="button-addon5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
  <button className="btn btn-primary" type="button" id="button-addon5" onClick={handlePasswordChange}>Update</button>
</div>
           
              
                </div>
              </div>
              <div className="bg-gray-800 text-white rounded-2xl">
                <div
                  className="w-full h-20 p-4 items-center  cursor-pointer"
                  onClick={() => {
                    setIsOpen6(!isOpen6);
                  }}
                >
                  Change Profile Visiblity
                </div>

                <div
                  className={`pl-4 pr-4 pb-4 transition-all duration-300 ${
                    isOpen6
                      ? "max-h-96 opacity-100 block"
                      : "max-h-0 opacity-0 overflow-hidden hidden"
                  }`}
                >
                  
                  <div className="form-check form-switch">
  <input className="form-check-input cursor-pointer" type="checkbox" role="switch" id="switchCheckDefault" checked={currentUserDetails?.profilePrivate || false} onChange={()=>handleProfileVisiblity( )}/>
  <label className="form-check-label" htmlFor="switchCheckDefault">Current Status{" ("}{currentUserDetails.profilePrivate===true?<>Private</>:<>Public</>}{")"}</label>
</div>

                </div>
              </div>
               <div
                  className="w-full h-20 p-4 items-center  cursor-pointer bg-gray-800 rounded-2xl mt-1"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                 
                  </div>

            </div>
          </div>
        </div>

        <div className="fixed top-4  right-4">
          <Link to={`/profile?user=${actualuser1}`}>
            <img
              src="close.png"
              alt=""
              className="w-5 h-5 hover:w-6 hover:h-6 active:w-4 active:h-4"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;
