import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";

export default function SingleChat(props) {
    
     const {currentUserDetails} =useContext(UserContext)
   
    
    const chat =props.chat;
    //const singlChatName =chat.users[0].filter((key ,item)=>(item!==currentUserDetails.username))
   const usernamereturn =(users)=>{
      if (users[0].username!=currentUserDetails.username) {
        return users[0]
      }
      else{
        return users[1]
      }
   }
   const singlChatName =usernamereturn(chat.users).username
  const profilePic =chat.chatName==="sender" ? usernamereturn(chat.users).profilePic:"/group-chat.png"
  return (

    <>
    <div className="w-full rounded-2xl pl-3 h-20 hover:bg-blue-100 flex  items-center mb-1 " >
    <div className="w-12 h-12 rounded-full"><img src={profilePic } onError={(e) => {
                  e.target.onerror = null;
                  e.target.src ="/pic.jpg"
                }} alt="" className="md:w-12 md:h-12 rounded-full w-10 h-10 bg-gray-400" /></div>
    <div className="ml-3">
      <div className="font-serif">{(chat.chatName==="sender" )?("@"+singlChatName) :(chat.chatName)}</div>
      <div className="font-light">{(chat.latestMessage.content)?(chat.latestMessage.sender.username===currentUserDetails.username?<><small className="bg-blue-300 rounded-xs pl-1 pr-1">{chat.latestMessage.sender.username }</small> : {chat.latestMessage.content}</>:<><small className="bg-blue-300 rounded-xs pl-1 pr-1">You</small> : {chat.latestMessage.content}</>):<></>}</div>
       </div>
    </div>
    </>
  )
}
