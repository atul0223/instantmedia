import { useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";
export default function UserContextProvider({ children }) {
  const actualuser1 = localStorage.getItem("actualuser1");
  const [loggedIn, setLoggedIn] = useState(true);
  const [selectedPost, setSelectedPost] = useState();
  const [singlePostopen, setsinglePostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserDetails,setCurrentUserDetails]=useState({})
  const [targetuser, setTargetUser] = useState({
    isPrivate: false,
    posts: {},
    profilePic:
      "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg",
    username: "",
    followerCount: 0,
    followingCount: 0,

    postCount: 0,
    isFollowing: false,
    requestStatus: "follow",
    sameUser: false,
    isblocked: false,
  });
const fetchCurrentUser =async()=>{
     try {
      const response = await axios.get(`${BACKENDURL}/user/getUser`, {
        withCredentials: true,
      });
      setCurrentUserDetails(response.data)
      console.log(response.data);
      
      
        return response.data;
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
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
        currentUserDetails
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
