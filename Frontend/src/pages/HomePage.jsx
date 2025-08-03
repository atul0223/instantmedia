import axios from "axios";
import { Post } from "../component/Post";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKENDURL } from "../config";
import UserContext from "../context/UserContext";

import Nav from "../component/Nav";
import Loading from "../component/Loading";
export default function HomePage() {
  const { actualuser1, setLoggedIn, loading, setLoading, singlePostopen } =
    useContext(UserContext);

  const navigate = useNavigate();
  const [posts, setPosts] = useState({});

  const LoadPosts = async () => {
    setLoading(true);
    const response = await axios
      .get(`${BACKENDURL}/home/`, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log(err);

        setLoggedIn(false);
        navigate("/");
      });

    setPosts(response.data.feedPosts);
    setLoading(false);
  };
  useEffect(() => {
    LoadPosts();
  }, []);
  return (
    <>
      {" "}
      <Loading />{" "}
      <div className="w-full min-h-screen bg-blue-100 p-3 relative ">
        <div className="h-100  w-full flex flex-wrap  sm:pl-10 sm:pr-10 mb-4">
          <div>
            <h5>For you</h5>
            <hr className="border-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-3.5 sm:gap-5 h-full  ">
            {Object.entries(posts).map(([key, postItem]) => (
              <Post
                key={key}
                postItem={postItem}
                postKey={key}
                sameUser={actualuser1 === postItem.publisherDetails.username}
              />
            ))}
          </div>
        </div>
        {loading || singlePostopen ? <></> : <Nav />}
      </div>
    </>
  );
}
