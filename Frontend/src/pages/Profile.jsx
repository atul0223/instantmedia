import { useEffect, useState } from "react";
import Posts from "../component/Post";
import axios from "axios";
import { BACKENDURL } from "../config";

export default function Profile() {
  const [profileData, setProfileData] = useState(
    "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg"
  );
 
  const [isPrivate, setisPrivate] = useState(false);
  const [posts,setPosts] =useState([]);
  const [username, setUsername] = useState("");
  const [postsCount, setPostCount] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [following, setFollowing] = useState(false);
  const [requestStatus, setRequestStatus] = useState("follow");
  const [btnType, setbtnType] = useState("btn btn-primary");
  const user = new URLSearchParams(window.location.search).get("user");
  const [isLoading, setIsLoading] = useState(false);
  const [sameUser, setSameUser] = useState(false);
  const [choice, setChoice] = useState(true);
  const [blocked, setBlocked] = useState(false); 
  const [canSee, setCansee] = useState(true);
 
  const toggleBlock = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BACKENDURL}/profile/${username}/toggleBlock`,
        { block: !blocked },
        { withCredentials: true }
      );

      await fetchUser(); 
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
        `${BACKENDURL}/profile/${username}/toggleFollow`,
        { follow: choice },
        { withCredentials: true }
      );

      await fetchUser(); // Refresh complete profile state
    } catch (error) {
      console.error("Toggle follow failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BACKENDURL}/profile/${user}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log(response.data);

        const data = response.data?.profileDetails;
        setisPrivate(response.data.isPrivate);
        setPosts(response.data.posts)
        setProfileData(data.profilePic);
        setUsername(data.username);
        setFollowers(data.followersCount);
        setFollowings(data.followingCount);
        setPostCount(data.postsCount);
        setFollowing(data.isFollowing);
        setRequestStatus(response?.data?.requestStatus);
        setSameUser(response.data.sameUser);
        setBlocked(response.data.isBlocked);
        const newRequestStatus = response.data.requestStatus;
        setRequestStatus(newRequestStatus);
        
        

        if (
          newRequestStatus === "requested" ||
          newRequestStatus === "unfollow"
        ) {
          setChoice(false);
        } else if (newRequestStatus === "follow") {
          setChoice(true);
        }

        if (
         ( response.data.isPrivate === true &&
          data.isFollowing === false) &&
          response.data.isBlocked===true
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
       const shouldHidePosts =
  response.data.isBlocked === true ||
  (response.data.isPrivate === true && data.isFollowing === false);

setCansee(!shouldHidePosts);



      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(true);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-blue-100 sm:pl-60 sm:pr-60 pl-4 pr-4">
      <div>
        <div className="h-100  w-full flex flex-wrap justify-center sm:pt-20 pt-20 gap-4  ">
          <div className="rounded-full sm:w-45 sm:h-45 w-30 h-30 overflow-hidden ">
            <img src={profileData} className="object-cover w-full h-full" />
          </div>
          <div className="w-full flex justify-center ">
            <h5> @{username}</h5>
          </div>
          <div className="w-full flex justify-center ml-4 sm:ml-0 gap-12 ">
            <div>{postsCount} posts</div>
            <div>{followers} followers</div>
            <div>{followings} following</div>
          </div>

          {sameUser === true ? (
            <p> </p>
          ) : (
            <div className="mb-10 flex mt-3 gap-10">
              {blocked ? (
                <></>
              ) : (
                <button
                  type="button"
                  className={btnType}
                  value={following}
                  onClick={toggleFollow}
                  disabled={isLoading}
                >
                  {requestStatus === "requested"
                    ? "Requested"
                    : following
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-danger"
                value={blocked}
                onClick={toggleBlock}
                 disabled={isLoading}
              >
                {blocked ? "Unblock" : "Block"}
              </button>
            </div>
          )}
        </div>
        <div>
          <hr />
          <div className="flex justify-center">
            <h5> posts</h5>
          </div>
          <hr />
        </div>

      <div className="flex justify-center ">
         <div >
            {blocked ?<></> : canSee?
  <div className="sm:flex flex-wrap gap-4">
    {posts.map(doc => (
      <div key={doc._id} className="w-full sm:w-60 bg-cover rounded shadow mb-4">
        <img
          src={doc.post}
          alt="Post Image"
          className="w-full h-auto object-cover mb-2"
        />
        <div className="p-2">
          <h5 className="text-lg font-semibold mb-1">{doc.title}</h5>
          <p className="text-sm text-gray-600">
            <small>{doc.updatedAt}</small>
          </p>
        </div>
      </div>
    ))}
  </div> : <Posts />}
          </div>
</div>
      </div>
    </div>
  );
}
