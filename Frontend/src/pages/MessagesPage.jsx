import Messages from "../component/messages";
import Loading from "../component/Loading";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";

export default function MessagesPage() {
  const { accessMessage ,setSelectedChat} = useContext(UserContext);
  const handleRefresh = () => {
    const chat = JSON.parse(localStorage.getItem("selectedChat"));
    setSelectedChat(chat)
    accessMessage(chat._id);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="block">
      <Loading />
      <Messages />
    </div>
  );
}
