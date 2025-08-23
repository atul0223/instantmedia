import { useContext, useEffect, useState } from "react";
import Loading from "../component/Loading.jsx"
import Nav from "../component/Nav.jsx"
import UserContext from "../context/UserContext.js";

import SingleChat from "../component/singleChat.jsx";
import axios from "axios";
import { BACKENDURL } from "../config.js";

export default function Chat() {
        const { actualuser1, loading, setLoading ,fetchCurrentUser} =useContext(UserContext);

        
        const[chats,setChats]=useState({})
        const fetchChats =async()=>{
         try {
          setLoading(true)
            const res = await axios.get(`${BACKENDURL}/chat/`,{withCredentials:true})
            console.log(res.data);
            setChats(res.data)
            setLoading(false)
            
            
         } catch (error) {
          console.log(error);
          
         }
        }
        useEffect(()=>{fetchChats();fetchCurrentUser()},[])
  return (
    <div className=" max-w-screen min-h-screen bg-purple-950 sm:grid grid-cols-6 grid-rows-1 "    >
        {loading ? <></> : <Nav />}
        <Loading/>
      <div className="col-span-2 w-full min-h-screen bg-blue-200 p-4">
      <h4 className="font-serif">Chats</h4>
      <hr/>
      <div className="mt-4">
        {chats && Object.entries(chats).map((chat) => {
          
          return(
            <div key={chat[1]._id}><SingleChat chat={chat[1]} key={chat._id} /></div>
          )
        })
        }
        
      </div>
      </div>
      <div className="col-span-4 w-full min-h-screen bg-blue-100 sm:block hidden"></div>
    </div>
  )
}
