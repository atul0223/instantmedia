import axios from "axios";
import { useContext, useState, useEffect, use } from "react";
import UserContext from "../context/UserContext";
import { BACKENDURL } from "../config";
import { useNavigate } from "react-router-dom";
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
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const { singlePostopen, setsinglePostOpen, actualuser1 } =
    useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);

  const fetchIsLiked = async (postId) => {
    const { data } = await axios.get(
      `${BACKENDURL}/profile/isLiked/${postId}`,
      {
        withCredentials: true,
      }
    );
    setIsLiked(data.isLiked);
  };
  const { fetchUser, targetuser, setLoading } = useContext(UserContext);
  const [activePost, setActivePost] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const handleAddComment = async (postId) => {
    try {
      setLikeLoading(true);
      const res = await axios.post(
        `${BACKENDURL}/profile/${postId}/addComment`,
        {
          inputComment: newComment,
        },
        { withCredentials: true }
      );
      setNewComment("");
      fetchPostDetails(postId);
    } catch (err) {
      console.error("Toggle like failed:", err);
    }

    setLikeLoading(false);
  };
  const handleDeleteComment = async (cId, postId) => {
    try {
      await axios.delete(`${BACKENDURL}/profile/deleteComment/${cId}`, {
        withCredentials: true,
      });

      fetchPostDetails(postId);
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  };
  const handleTogleLike = async (postId) => {
    try {
      setLikeLoading(true);
      const res = await axios.post(
        `${BACKENDURL}/profile/${postId}/togglelike`,
        {
          like: !isLiked,
        },
        { withCredentials: true }
      );

      fetchPostDetails(postId);
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
    setLikeLoading(false);
  };
  const fetchPostDetails = async (postId) => {
    try {
      const res = await axios.get(
        `${BACKENDURL}/profile/getSinglePost/${postId}`,
        {
          withCredentials: true,
        }
      );
      setActivePost(res.data.post);
      setComments(res.data.post.comments);
      await fetchIsLiked(postId);
    } catch (error) {
      console.error("Fetch post details failed:", error);
    }
  };
  const handleOpenModal = async (postId) => {
    try {
      setsinglePostOpen(true);
      setLoading(true);
      await fetchPostDetails(postId);
    } catch (error) {
      console.error("Delete post failed:", error);
    }
    setLoading(false);
  };

  const handleDeletePosts = async (postId) => {
    try {
      setLoading(true);
      await axios.delete(`${BACKENDURL}/profile/deletePost/${postId}`, {
        withCredentials: true,
      });
      fetchUser(targetuser.username);
    } catch (error) {
      console.error("Delete post failed:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (singlePostopen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [singlePostopen]);

  if (singlePostopen && activePost) {
    return (
      <div className="fixed inset-0 z-50 bg-blue-50 flex items-baseline justify-center p-2 ">
        <div className="fixed top-4 right-4 flex justify-center items-center bg-zinc-100 z-50 rounded-full w-12 h-12  shadow-2xl shadow-black">
          <img
            src="close.png"
            alt=""
            className="w-6 h-6 rounded-full  hover:h-5 hover:w-5"
            onClick={() => setsinglePostOpen(false)}
          />
        </div>
        <div className="w-full h-full border-2 border-zinc-200 rounded-3xl shadow-2xl shadow-black sm:flex justify-center gap-5 md:gap-0 overflow-y-scroll sm:overflow-y-visible">
          <div className=" rounded-4xl w-full md:h-3/4 h-2/3 border-2 md:ml-20 md:mr-10 lg:ml-30 lg-mr-10 sm:ml-10 sm:mt-10 xl:ml-40 xl-mr-10 border-gray-300 mb-3 grid grid-rows-12 shadow-2xl shadow-blue-100">
            <div
              className=" h-10 rounded-full m-3 flex gap-2 row-span-1"
              onClick={() => {
                setsinglePostOpen(false);
                navigate(
                  `/profile?user=${activePost.publisherDetails.username}`
                );
              }}
            >
              <img
                src={activePost.publisherDetails.profilePic}
                alt=""
                className="w-10 h-10 rounded-full"
              />

              <small className="mt-2 hover:cursor-pointer">
                @{activePost.publisherDetails.username}
              </small>
            </div>
            <div className="max-w-full mt-6 min-h-3/4 pl-7 pr-7 pb-2 justify-center flex row-span-10">
              <img src={activePost.post} alt="" className="rounded-4xl" />
            </div>
            <div className="max-w-full row-span-1 flex gap-10 p-2 justify-center border-t-1 border-t-gray-200">
              <div
                className="h-6 w-6 hover:w-7 flex gap-2 "
                onClick={() => handleTogleLike(activePost._id)}
                style={likeLoading ? { pointerEvents: "none" } : {}}
              >
                {isLiked ? (
                  <img
                    src="heart (1).png"
                    alt=""
                    className="hover:w-7 hover:h-7"
                  />
                ) : (
                  <img src="heart.png" alt="" className="hover:w-7 hover:h-7" />
                )}
                <small>{activePost.likesCount}</small>
              </div>
              <div className="h-6 w-6 hover:w-7 flex gap-2">
                <img src="comment.png" alt="" className="hover:w-7 hover:h-7" />
                <small>{activePost.commentsCount}</small>
              </div>
              <div className="w-6 h-6 hover:w-7">
                <img src="send.png" alt="" className="hover:w-7 hover:h-7" />
              </div>
            </div>
          </div>
          <div className="  rounded-4xl w-full h-full max-h-2/3 border-2 sm:mt-10 sm:mr-10 lg:mr-30 border-gray-300 overflow-y-scroll ">
            <div className="sticky flex h-20 w-full items-baseline px-6 py-3  gap-3 border-b-2 border-b-gray-200 ">
              <input
                type="text"
                className="h-12 w-full rounded-3xl border-2 p-3 "
                placeholder="Add comment"
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
                autoFocus
              />
              <button
                className="btn btn-primary"
                onClick={() => handleAddComment(activePost._id)}
              >
                Post
              </button>
            </div>
            <div className="w-full">
              {activePost.comments.length === 0 ? (
                <div className="w-full flex justify-center items-center">
                  <p className="text-gray-600 text-lg">No comments</p>
                </div>
              ) : (
                <div className="space-y-1 w-full">
                  {comments.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col w-full border rounded-2xl bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={item.commenterDetails.profilePic}
                          alt={`${item.commenterDetails.username}'s profile`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="font-bold text-sm text-gray-800 pt-2 flex">
                          @{item.commenterDetails.username}
                          {item.commenterDetails.username ===
                          activePost.publisherDetails.username ? (
                            <p className="ml-1">{"  (publisher)"}</p>
                          ) : (
                            <></>
                          )}{" "}
                        </div>
                        {item.commenterDetails.username === actualuser1 ? (
                          <div className="w-full flex justify-end">
                            <img
                              src="delete.png"
                              alt=""
                              className="w-5 h-5 hover:w-6 hover:h-6"
                              onClick={() => {
                                handleDeleteComment(item._id, activePost._id);
                              }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 break-words whitespace-normal">
                        {item.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Loading />
        <div
          key={`${key}-${postItem._id}`}
          className=" shadow-gray-600 shadow-md h-fit w-fit rounded-2xl sm:mb-0  relative group overflow-hidden"
        >
          <div
            onClick={(e) => {
              handleOpenModal(postItem.postDetails._id);
            }}
          >
            <img
              src={postItem.postDetails.post}
              alt="Post Image"
              className=" rounded-2xl object-fill  group-hover:brightness-75  sm:h-90 sm:w-70 w-40 h-60 "
            />
          </div>

          {sameUser ? (
            <div
              className="absolute top-3 right-3 sm:group-hover:bottom-0 sm:opacity-1 group-hover:opacity-100  rounded-2xl overflow-hidden w-10 h-10 hover:w-11 hover:h-11"
              onClick={() => handleDeletePosts(postItem.postDetails._id)}
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
}
