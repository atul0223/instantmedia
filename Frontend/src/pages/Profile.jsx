import { useEffect, useState, useContext } from "react";
import { Post, PostsPrivate } from "../component/Post";
import axios from "axios";
import { BACKENDURL } from "../config";
import UserContext from "../context/UserContext";
import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";

export default function Profile() {
  const {
    targetuser,
    fetchUser,
    loggedIn,
    setLoading,
    loading,
    singlePostopen,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const user = new URLSearchParams(window.location.search).get("user");
  const [btnType, setbtnType] = useState("btn btn-primary");
  const [choice, setChoice] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [canSee, setCansee] = useState(true);
  const fetchuser = async () => {
    setLoading(true);
    if (!loggedIn) {
      navigate("/");
    }
    const data = await fetchUser(user);

    const newRequestStatus = data.requestStatus;

    if (newRequestStatus === "requested" || newRequestStatus === "unfollow") {
      setChoice(false);
    } else if (newRequestStatus === "follow") {
      setChoice(true);
    }

    if (newRequestStatus === "unfollow") {
      setbtnType("btn btn-outline-dark");
    } else if (newRequestStatus === "requested") {
      setbtnType("btn btn-outline-secondary");
    } else {
      setbtnType("btn btn-primary");
    }

    const shouldHidePosts =
      data.isBlocked ||
      (data.isPrivate && !data.profileDetails.isFollowing && !data.sameUser);
    setCansee(!shouldHidePosts);
    setLoading(false);
  };
  const toggleBlock = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BACKENDURL}/profile/${targetuser.username}/toggleBlock`,
        { block: !targetuser.isblocked },
        { withCredentials: true }
      );

      await fetchuser();
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
        `${BACKENDURL}/profile/${targetuser.username}/toggleFollow`,
        { follow: choice },
        { withCredentials: true }
      );

      fetchuser();
    } catch (error) {
      console.error("Toggle follow failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  


  useEffect(() => {
    fetchuser();
  
  }, [user]);
 
    return (
      <div className="w-full min-h-screen bg-blue-100 sm:pl-20 sm:pr-20 md:pl-30 md:pr-30 lg:pl-30 lg:pr-30 xl:pl-50 xl:pr-50 pl-4 pr-4">
        <div>
          <Loading />
          <div className="flex justify-end">
            {" "}
            {targetuser.sameUser ? (
              <div className="w-10 h-10 mt-4 ">
                <img
                  src="setting.png"
                  alt=""
                  className=" hover:w-9 hover:h-9 hover:mt-1"
                  onClick={() => {
                   navigate("/settings")
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="h-100  w-full flex flex-wrap justify-center pt-15 gap-4  ">
            <div className="rounded-full sm:w-45 sm:h-45 w-30 h-30 overflow-hidden ">
              <img
                src={targetuser.profilePic}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg";
                }}
              />
            </div>
            <div className="w-full flex justify-center ">
              <h5> @{targetuser.username}</h5>
            </div>
            <div className="w-full flex justify-center ml-4 sm:ml-0 gap-12 ">
              <div>{targetuser.postCount} posts</div>
              <div>{targetuser.followerCount} followers</div>
              <div>{targetuser.followingCount} following</div>
            </div>

            {targetuser.sameUser === true ? (
              <p> </p>
            ) : (
              <div className="mb-10 flex mt-3 gap-10">
                {targetuser.isblocked ? (
                  <></>
                ) : (
                  <button
                    type="button"
                    className={btnType}
                    value={targetuser.isfollowing}
                    onClick={toggleFollow}
                    disabled={isLoading}
                  >
                    {targetuser.requestStatus === "requested"
                      ? "Requested"
                      : targetuser.isFollowing
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  value={targetuser.isblocked}
                  onClick={toggleBlock}
                  disabled={isLoading}
                >
                  {targetuser.isblocked ? "Unblock" : "Block"}
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
            {targetuser.isblocked ? (
              <></>
            ) : canSee ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3.5 sm:gap-5 h-full  ">
                {targetuser.postCount === 0 ? (
                  <div className=" font-light mt-10 font-serif col-span-3 font-center lg:ml-14">
                    <h4 className="">no posts</h4>
                  </div>
                ) : (
                  Object.entries(targetuser.posts).map(([key, postItem]) => (
                    <Post
                      key={key}
                      postItem={postItem}
                      postKey={key}
                      sameUser={targetuser.sameUser}
                    />
                  ))
                )}
              </div>
            ) : (
              <PostsPrivate />
            )}
          </div>
        </div>
        {loading || singlePostopen ? <></> : <Nav />}
      </div>
    );
  }

