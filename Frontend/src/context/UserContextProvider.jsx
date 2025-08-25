import { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";
export default function UserContextProvider({ children }) {
  const actualuser1 = localStorage.getItem("actualuser1");
  const [loggedIn, setLoggedIn] = useState(true);
  const [selectedPost, setSelectedPost] = useState();
  const [singlePostopen, setsinglePostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [selectedChat, setSelectedChat] = useState([]);
  const [messages, setMessages] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [targetuser, setTargetUser] = useState({
    isPrivate: false,
    posts: {},
    profilePic: "/pic.jpg",
    username: "",
    followerCount: 0,
    followingCount: 0,

    postCount: 0,
    isFollowing: false,
    requestStatus: "follow",
    sameUser: false,
    isblocked: false,
  });
  const accessMessage = async (chatId) => {

    setLoading(true)
    const res = await axios.get(`${BACKENDURL}/chat/${chatId}/getMessages`, {
      withCredentials: true,
    });
 
    setMessages(res.data);
    setLoading(false)
    return res.data;
  };
  const accessChat = async (userId) => {
    const res = await axios.post(
      `${BACKENDURL}/chat/accessChat`,
      { userId1: userId },
      { withCredentials: true }
    );
    
    setSelectedChat(res.data);
    return res.data;
  };
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/user/getUser`, {
        withCredentials: true,
      });
      setCurrentUserDetails(response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
   useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    setIsSmallScreen(mediaQuery.matches);

    const handler = (e) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const fetchUser = async (username) => {
    try {
      const response = await axios.get(`${BACKENDURL}/profile/${username}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const data = response.data;

        setTargetUser({
          isPrivate: data.isPrivate,
          posts: data.posts,
          username: data.profileDetails.username,
          followerCount: data.profileDetails.followersCount,
          followingCount: data.profileDetails.followingCount,

          profilePic: data.profileDetails.profilePic,

          postCount: data.profileDetails.postsCount,
          isFollowing: data.profileDetails.isFollowing,
          requestStatus: data.requestStatus,
          sameUser: data.sameUser,
          isblocked: data.isBlocked,
        });
        return response.data;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        actualuser1,
        selectedPost,
        loggedIn,
        setLoggedIn,
        fetchUser,
        targetuser,
        setTargetUser,
        setSelectedPost,
        loading,
        setLoading,
        singlePostopen,
        setsinglePostOpen,
        fetchCurrentUser,
        currentUserDetails,
        accessChat,
        accessMessage,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        isSmallScreen
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
