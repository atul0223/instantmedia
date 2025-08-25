
import React, { useState, useContext, useEffect, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import UserContext from "../context/UserContext";
import { BACKENDURL } from "../config";
import axios from "axios";
    import { useNavigate } from 'react-router-dom';

export default function Messages() {
      const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const[sendDisable,setSendDisabled]=useState(false)
  const { selectedChat, messages, currentUserDetails,isSmallScreen, setSelectedChat,accessMessage,fetchCurrentUser} =
    useContext(UserContext);
  const bottomRef = useRef(null);
  const userReturn = (users) => {
    if (!users) {
      return;
    }
    if (users[0].username != currentUserDetails.username) {
      return users[0];
    } else {
      return users[1];
    }
  };
  const handleRefresh = () => {
    const chat = JSON.parse(localStorage.getItem("selectedChat"));
    setSelectedChat(chat)
    accessMessage(chat._id);
  };

  const moveToLastMsg = () =>
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  useEffect(() => {
    fetchCurrentUser()
    handleRefresh()
    moveToLastMsg();
 
    
    const container = document.getElementById("message-scroll-container");

    const handleScroll = () => {
      const isBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      setIsAtBottom(isBottom);
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const [newMsg, setNewMsg] = useState("");
  const selectedChatMetaData = userReturn(selectedChat.users);
  const profilePic =
    selectedChat.chatName === "sender"
      ? userReturn(selectedChat.users).profilePic
      : "/group-chat.png";
  const shouldShowPic = (index) => {
    // If it's the last message, always show the profile pic
    if (index === 0) return true;

    const currentSender = messages[index]?.sender?.username;
    const previousSender = messages[index - 1]?.sender?.username;

    // If the next message is from a different sender, show the pic
    return currentSender !== previousSender;
  };
  const handleSendMessage = async (e) => {
    setSendDisabled(true)
    const res = await axios.post(
      `${BACKENDURL}/chat/sendmessage`,
      { chatId: selectedChat._id, content: newMsg },
      { withCredentials: true }
    );
    setSendDisabled(false)
    setNewMsg("");
  };
  if (!selectedChat?.chatName && !isSmallScreen) {
    return (
      <div className="w-full h-full bg-blue-100  justify-center items-center font-extralight text-center font-serif select-none sm:block hidden">
        <h1>
          Start chatting <br />
          Now...
        </h1>
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen bg-blue-100 pb-35">
       
        <div
          className={`fixed bottom-15 -right-5 flex justify-end items-center px-10 py-6 ${
            isAtBottom ? "hidden" : "block"
          }`}
        >
          <div className="w-11 h-11 bg-gray-950 opacity-75 hover:bg-gray-600 cursor-pointer active:bg-gray-400   text-white rounded-full flex justify-center items-center">
            <MdKeyboardArrowDown
              className="w-10 h-10"
              onClick={moveToLastMsg}
            />
          </div>
        </div>
        <div className="sticky w-full h-17 bg-blue-200 flex items-center ">
          {isSmallScreen?<img src="/arrow.png" alt="" className="w-10 h-10 hover:bg-gray-500 rounded-xl active:bg-gray-500 active:w-9 active:h-9 ml-4"onClick={() => navigate(-1)}/>:<></>}
          <img
            src={profilePic}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/pic.jpg";
            }}
            className="w-12 h-12 rounded-full ml-3 bg-gray-400"
          />
          <h6 className="ml-4 mt-1 font-serif">
            {selectedChat.chatName === "sender"
              ? "@" + selectedChatMetaData.username
              : selectedChat.chatName}
          </h6>
        </div>
        <div
          className=" w-full h-full overflow-y-scroll"
          id="message-scroll-container"
        >
          <div className="w-full flex justify-center ">
            <div className=" w-1/2 h-fit flex justify-center items-center p-2 mt-4 mb-4 bg-black opacity-75  break-words rounded m-1 text-amber-300 text-center select-none">
              <small>
                Messages are end-to-end encrypted. Only people in this chat can
                read,
                <br />
                listen to, or share them. Click to learn more
              </small>
            </div>
          </div>
          <div>
            {messages.map((item, index) => {
              return item.sender._id === currentUserDetails._id ? (
                <div className="flex mr-2 justify-end" key={item._id}>
                  <div
                    className={`max-w-2/3 w-fit h-fit p-2 bg-emerald-200 break-words rounded-tl-xl rounded-br-xl ${
                      shouldShowPic(index) ? "" : "rounded-tr-xl"
                    } rounded-bl-xl mb-1`}
                  >
                    {item.content}
                  </div>
                  {/* {shouldShowPic(index) ? (
        <img src={item.sender.profilePic} alt="" className="w-10 h-10 rounded-full ml-1" />
      ): */}
                  <div className="w-11 h-11"></div>
                </div>
              ) : (
                <div className="flex gap-2 ml-2" key={item._id}>
                  {shouldShowPic(index) ? (
                    <img
                      src={item.sender.profilePic}
                      alt=""
                      className="w-10 h-10 rounded-full mr-1"
                      onError={(e) => {
              e.target.onerror = null; e.target.src = "/pic.jpg";
             }}
                        />
                  ) : (
                    <div className="w-11 h-11"></div>
                  )}{" "}
                  <div
                    className={`max-w-2/3 w-fit h-fit p-2 bg-white break-words rounded-tr-xl rounded-br-xl rounded-bl-xl mb-1 ${
                      shouldShowPic(index) ? "" : "rounded-tl-xl"
                    } `}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}{" "}
            <div ref={bottomRef} />
          </div>

          <form
            action="submit"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <div className=" absolute bottom-3 flex gap-3 pl-3 sm:w-2/3 sm:pr-9 w-full pr-5">
              <input
                className=" form-control mr-sm-2 h-13 "
                type="text"
                placeholder="Type a message"
                aria-label="Type a message"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary" disabled={sendDisable}>Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
