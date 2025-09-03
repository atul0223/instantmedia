import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import socket from "../helper/socket";

export default function SingleChat(props) {
  const [latestMessage, setLatestMesssage] = useState();
  const navigate = useNavigate();
  const { currentUserDetails, accessMessage, setSelectedChat, isSmallScreen } =
    useContext(UserContext);
  const selectedChat = JSON.parse(localStorage.getItem("selectedChat"));

  const chat = props.chat;


  const userReturn = (users) => {
    if (users[0].username != currentUserDetails.username) {
      return users[0];
    } else {
      return users[1];
    }
  };
  const singlChatName = userReturn(chat.users)?.username;
  const profilePic =
    chat.chatName === "sender"
      ? userReturn(chat.users)?.profilePic
      : chat?.pic || "/group-chat.png";
  const handleAccessChat = () => {
    setSelectedChat(chat);
    localStorage.setItem("selectedChat", JSON.stringify(chat));
    accessMessage(chat._id);
  };
  const [senderName, setSenderName] = useState();
  useEffect(() => {
    setLatestMesssage(chat?.latestMessage.content);
    setSenderName(chat?.latestMessage?.sender?.username);
  }, [chat]);
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.chat._id === chat._id) {
        setLatestMesssage(msg?.content);
        
        setSenderName(msg.sender.username);
      }
    });
  }, [socket]);
  return (
    <>
      <div
        className={`w-full rounded-2xl pl-3  overflow-hidden h-20 hover:bg-blue-100 flex  items-center mb-1 cursor-pointer ${
          selectedChat?._id === chat._id ? "bg-blue-100" : ""
        }`}
        onClick={() => {
          handleAccessChat();
          isSmallScreen ? navigate("/chat/messages") : <></>;
        }}
      >
        <div className="w-12 h-12 rounded-full">
          <img
            src={profilePic || "pic.jpg"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/pic.jpg";
            }}
            alt=""
            className="md:w-12 md:h-12 rounded-full w-10 h-10 bg-gray-400"
          />
        </div>
        <div className="ml-3">
          <div className="font-serif">
            {chat.chatName === "sender" ? "@" + singlChatName : chat.chatName}
          </div>
          <div className="font-light">
            {latestMessage && (
              <>
                <small className="bg-blue-300 rounded-xs pl-1 pr-1">
                  {senderName === currentUserDetails.username
                    ? "You"
                    : senderName}
                </small>
                : {latestMessage}
              </>
            )}
          </div>{" "}
        </div>
      </div>
    </>
  );
}
