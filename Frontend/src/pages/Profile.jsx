import { useEffect, useState } from "react";
import Post from "../component/Post";
import axios from "axios";
import { BACKENDURL } from "../config";

export default function Profile() {
  const [profileData, setProfileData] = useState(
    "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg"
  );
  const [username, setUsername] = useState("");
  const [postsCount, setPostCount] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [following, setFollowing] = useState(false);
  const [btnType,setbtnType] =useState("btn btn-primary")
  const user = new URLSearchParams(window.location.search).get("user");
  const [isLoading, setIsLoading] = useState(false);

const toggleFollow = async () => {
  setIsLoading(true);
  try {
    await axios.post(
      `${BACKENDURL}/profile/${username}/toggleFollow`,
      { follow: !following },
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
        const data = response.data?.profileDetails;
        setProfileData(data.profilePic);
        setUsername(data.username);
        setFollowers(data.followersCount);
        setFollowings(data.followingCount);
        setPostCount(data.postsCount);
        setFollowing(data.isFollowing);
        if (data.isFollowing) {
          setbtnType("btn btn-outline-dark")

        }
        else{
          setbtnType("btn btn-primary")
        }
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
    <div className="w-screen h-screen bg-blue-100 sm:pl-60 sm:pr-60 pl-4 pr-4">
      <div>
        <div className="h-100  w-full flex flex-wrap justify-center sm:pt-20 pt-20 gap-4  ">
          <div className="rounded-full sm:w-45 sm:h-45 w-30 h-30 overflow-hidden ">
            <img src={profileData} className="object-cover w-full h-full" />
          </div>
          <div className="w-full flex justify-center ">
            <h5> @{username}</h5>
          </div>
          <div className="w-full flex justify-center  gap-12 ">
            <div>{postsCount} posts</div>
            <div>{followers} followers</div>
            <div>{followings} following</div>
          </div>

          <div className="mb-10 flex mt-3 gap-10">
            <button
              type="button"
              className={btnType}
              value={following}
              onClick={toggleFollow}
              disabled={isLoading}
            >
              {following ? "unfollow" : "follow"}
            </button>
            <button type="button" className="btn btn-outline-danger">
              Block
            </button>
          </div>
        </div>
        <div>
          <hr />
          <div className="flex justify-center">
            <h5> posts</h5>
          </div>
          <hr />
        </div>

        <div className="flex justify-center ">
          <div className="">
            <Post />
          </div>
        </div>
      </div>
    </div>
  );
}
