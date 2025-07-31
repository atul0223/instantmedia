import { useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";
export default function UserContextProvider({ children }) {
  const currentUserName = localStorage.getItem("currentUserName");
  const [loggedIn, setLoggedIn] = useState(true);
  const [selectedPost, setSelectedPost] = useState();
  const [loading,setLoading] =useState(false)
  const [targetUser, setTargetUser] = useState({
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
        currentUserName,
        selectedPost,
        loggedIn,
        setLoggedIn,
        fetchUser,
        targetUser,
        setTargetUser,
        setSelectedPost,
        loading,setLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
