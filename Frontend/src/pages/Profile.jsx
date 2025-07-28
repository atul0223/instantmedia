import { useEffect, useState ,useContext} from "react";
import { Post, PostsPrivate } from "../component/Post";
import axios from "axios";
import { BACKENDURL } from "../config";
import UserContext from "../context/UserContext";
export default function Profile() {
    const {targetUser,fetchUser,setTargetUser} =useContext(UserContext)
   
   const user = new URLSearchParams(window.location.search).get("user");
  const[btnType,setbtnType] =useState("btn btn-primary")
  const[choice,setChoice] =useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const[canSee,setCansee]=useState(true)
  const fetchuser=async () => {
   const data = await fetchUser(user)
        const newRequestStatus = data.requestStatus;
       
        if (
          newRequestStatus === "requested" ||
          newRequestStatus === "unfollow"
        ) {
          setChoice(false);
        } else if (newRequestStatus === "follow") {
          setChoice(true);
        }

        if (
          data.isPrivate === true &&
          data.profileDetails.isFollowing === false &&
          data.isBlocked === true
        ) {
          setCansee(false);
        } else {
          setCansee(true);
        }

        if (newRequestStatus === "unfollow") {
          setbtnType("btn btn-outline-dark");
        } else if (newRequestStatus === "requested") {
          setbtnType("btn btn-outline-secondary");
        } else {
          setbtnType("btn btn-primary");
        }
        
        const shouldHidePosts = data.isBlocked || (data.isPrivate && !data.profileDetails.isFollowing);
setCansee(!shouldHidePosts);
const getFollowButtonLabel = (status, isFollowing) => {
  if (status === "requested") return "Requested";
  return isFollowing ? "Unfollow" : "Follow";
};


 
  
  }
  const toggleBlock = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BACKENDURL}/profile/${targetUser.username}/toggleBlock`,
        { block: !targetUser.isblocked },
        { withCredentials: true }
      );

     await fetchuser()
    } catch (error) {
      console.error("Toggle block failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BACKENDURL}/profile/${targetUser.username}/toggleFollow`,
        { follow: choice },
        { withCredentials: true }
      )
      
      
      fetchuser()
    } catch (error) {
      console.error("Toggle follow failed:", error);
    } finally {
      setIsLoading(false)
    }
  };

  
  useEffect(() => {
      fetchuser()
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-blue-100 sm:pl-20 sm:pr-20 md:pl-30 md:pr-30 lg:pl-30 lg:pr-30 xl:pl-50 xl:pr-50 pl-4 pr-4">
      <div>
        <div className="h-100  w-full flex flex-wrap justify-center sm:pt-20 pt-20 gap-4  ">
          <div className="rounded-full sm:w-45 sm:h-45 w-30 h-30 overflow-hidden ">
            <img src={targetUser.profilePic} className="object-cover w-full h-full" />
          </div>
          <div className="w-full flex justify-center ">
            <h5> @{targetUser.username}</h5>
          </div>
          <div className="w-full flex justify-center ml-4 sm:ml-0 gap-12 ">
            <div>{targetUser.postCount} posts</div>
            <div>{targetUser.followerCount} followers</div>
            <div>{targetUser.followingCount} following</div>
          </div>

          {targetUser.sameUser === true ? (
            <p> </p>
          ) : (
            <div className="mb-10 flex mt-3 gap-10">
              {targetUser.isblocked ? (
                <></>
              ) : (
                <button
                  type="button"
                  className={btnType}
                 value={targetUser.isfollowing}
                  onClick={toggleFollow}
                   disabled={isLoading}
                >
                 {targetUser.requestStatus === "requested"
                    ? "Requested"
                    : (targetUser.isFollowing
                    ? "Unfollow"
                    : "Follow")} 
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-danger"
               value={targetUser.isblocked}
                onClick={toggleBlock}
                disabled={isLoading}
              >
                {targetUser.isblocked ? "Unblock" : "Block"} 
              </button>
            </div>
          )}
        </div>
        <div className=" mb-7">
          <hr />
          <h5 className="text-center text-stone-600 font-serif ">Moments</h5>
          <hr />
        </div>

        <div className="flex justify-center pb-4">
          {targetUser.isblocked ? 
            <></>
           : canSee ? ( 
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3.5 sm:gap-5 h-full  ">
              {
              targetUser.postCount === 0 ? (
                  <div className=" font-light mt-10 font-serif col-span-3 font-center lg:ml-14">
                    <h4 className="">no posts</h4>
                  </div>
                ) :
              Object.entries(targetUser.posts).map(([key, postItem]) =>
                <Post key={key} postItem={postItem} postKey={key} sameUser={targetUser.sameUser}/>
              )}
            </div>
           ) : (
            <PostsPrivate />
          )} 
        </div>
      </div>
    </div>
  );
}
