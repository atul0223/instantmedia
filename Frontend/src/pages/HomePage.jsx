import axios from "axios";
import { Post } from "../component/Post";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKENDURL } from "../config";
import UserContext from "../context/UserContext";

import Nav from "../component/Nav";
export default function HomePage() {
    const{currentUserName, setLoggedIn} =useContext(UserContext)
    
    
    const navigate = useNavigate()
  const [posts, setPosts] = useState({});
  const handleLogout =async()=>{
     const res =await axios.get(`${BACKENDURL}/user/logout`, {
      withCredentials: true,
    }).then(()=>{
      setLoggedIn(false)
      navigate("/")
    })
   
    
  }
  const LoadPosts = async () => {
    const response = await axios.get(`${BACKENDURL}/home/`, {
      withCredentials: true,
    }).catch(err => {
      console.log(err);
      
      setLoggedIn(false);
     navigate("/")});
  
    console.log(response);
    
    setPosts(response.data.feedPosts);
  };
  useEffect(() => {
    LoadPosts();
  }, []);
  return ( <>    <div className="w-full min-h-screen bg-blue-100 p-3 relative ">
      
        <div className="h-100  w-full flex flex-wrap  sm:pl-10 sm:pr-10 mb-20">
      <div><h5>For you</h5>
      <hr  className="border-2"/>
      <div className="w-10 h-10 absolute sm:right-15 right-4 top-4"><img src="power-button.png" alt="" onClick={handleLogout}/></div>
      </div>
      
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-3.5 sm:gap-5 h-full  ">
     
      {Object.entries(posts).map(([key, postItem]) => (
        <Post key={key} postItem={postItem} postKey={key} sameUser={currentUserName===postItem.publisherDetails.username}/>
      ))}</div>
      </div>
     <Nav/>
      </div>
      
    
</>
  );
}
