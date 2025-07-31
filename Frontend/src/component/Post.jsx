import axios from "axios";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import { BACKENDURL } from "../config";
import Loading from "./Loading";
export function PostsPrivate() {
  return (
    <div className="flex justify-center mt-7 h-52">
      <div className="w-20 h-20 ">
        <img src="/locked.png" alt="" />
      </div>
      <div className="">
        <h5>
          This account is private <br />
          Follow to see their photos and videos.
        </h5>
      </div>
    </div>
  );
}

export function Post(props) {
  const key = props.postKey;
  const postItem = props.postItem;
  const sameUser = props.sameUser;
  const { fetchUser, targetUser, loggedIn,setLoading } = useContext(UserContext);

  const handleDeletePosts = async (postId) => {
    try {
      setLoading(true)
      await axios.delete(`${BACKENDURL}/profile/deletePost/${postId}`, {
        withCredentials: true,
      });
      fetchUser(targetUser.username);
    } catch (error) {
      console.error("Delete post failed:", error);
    }
    setLoading(false)
  };
  return (
    <div>
      <Loading/>
      <div
        key={`${key}-${postItem._id}`}
        className=" shadow-gray-600 shadow-md h-fit w-fit rounded-2xl sm:mb-0  relative group overflow-hidden"
      >
        <div>
          <img
            src={postItem.postDetails.post}
            alt="Post Image"
            className=" rounded-2xl object-fill  group-hover:brightness-75  sm:h-90 sm:w-70 w-40 h-60 "
          />
        </div>

        {sameUser ? (
          <div
            className="absolute top-3 right-3 sm:group-hover:bottom-0 sm:opacity-1 group-hover:opacity-100  rounded-2xl overflow-hidden w-10 h-10 hover:w-11 hover:h-11"
            onClick={(e) => {
              e.preventDefault();
              const postId = e.target.getAttribute("data_id");
         

              handleDeletePosts(postId);
            }}
            data_id={postItem.postDetails._id}
          >
            <img
              src="/delete.png"
              alt="/delete.png"
              data_id={postItem.postDetails._id}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
