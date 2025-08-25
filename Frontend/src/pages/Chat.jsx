import { useContext, useEffect, useState } from "react";
import Loading from "../component/Loading.jsx";

import UserContext from "../context/UserContext.js";

import SingleChat from "../component/singleChat.jsx";
import axios from "axios";
import { BACKENDURL } from "../config.js";
import { useNavigate } from "react-router-dom";
import Messages from "../component/messages.jsx";

export default function Chat() {
  
  const navigate = useNavigate();
  const [targetSearch, setTargetSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const {
   
    setLoading,
    fetchCurrentUser,
    accessChat,
    accessMessage,
    isSmallScreen
  } = useContext(UserContext);
  const [searchData, setSearchData] = useState([]);
  const handleSearch = async (e) => {
    setTargetSearch(e.target.value);
    e.target.value !== "" ? setIsSearching(true) : setIsSearching(false);
    const res = await axios
      .get(`${BACKENDURL}/home/search`, {
        params: { query: e.target.value },
        withCredentials: true,
      })
      .catch((err) => console.log(err));
 

    setSearchData(res.data);
  };
  const [chats, setChats] = useState({});
  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKENDURL}/chat/`, {
        withCredentials: true,
      });
      setChats(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchChats();
    fetchCurrentUser();
    
  }, []);
  const handleAccessChat = (userId) => {
    setLoading(true)
   accessChat(userId).then((chatDetails)=>accessMessage(chatDetails._id))
 
   setLoading(false)
  
  };
  return (
    <div className=" max-w-screen max-h-screen sm:grid grid-cols-6 grid-rows-1">
      <Loading />
      <div className="col-span-2 w-full h-screen bg-blue-200 p-4 overflow-auto">
        <div className="flex ">
          {" "}
          <img
            src="/arrow.png"
            alt=""
            className="w-10 h-10 hover:bg-gray-500 rounded-xl active:bg-gray-500 active:w-9 active:h-9"
            onClick={() => {
              navigate("/home");
            }}
          />
          <h4 className="font-serif mt-1 ml-3 ">Chats</h4>
        </div>
        <hr />
        <input
          className=" form-control mr-sm-2 h-13 rounded-full"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={targetSearch}
          onChange={handleSearch}
          autoFocus
        />

        {isSearching ? (
          <>
            {searchData.map((item) => {
              return (
                <div key={item._id} className="mt-3 cursor-pointer">
                  <div
                    className="w-full rounded-2xl pl-3 h-20 hover:bg-blue-100 flex  items-center mb-1 "
                    key={searchData._id}
                    onClick={() => {handleAccessChat(item._id)
                      isSmallScreen?navigate("/"):<></>}}
                  >
                    <div className="w-12 h-12 rounded-full">
                      <img
                        src={item.profilePic}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/pic.jpg";
                        }}
                        alt=""
                        className="md:w-12 md:h-12 rounded-full w-10 h-10 bg-gray-400"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-serif">@{item.username}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="mt-4 ">
            {chats &&
              Object.entries(chats).map((chat) => {
                return (
                  <div key={chat[1]._id}>
                    <SingleChat chat={chat[1]} key={chat._id} />
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <div className="col-span-4 w-full min-h-screen bg-blue-100 sm:block hidden ">
        <Messages />
      </div>
    </div>
  );
}
