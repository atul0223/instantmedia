import axios from "axios";
import { Post } from "../component/Post";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="w-full min-h-screen bg-blue-100 p-3">
      {" "}
      <Loading />{" "}
      <div className="w-full  bg-blue-100 p-3 relative flex">
        <div className="xl:pl-30 ">
          <h5>For you</h5>
          <hr className="border-2 w-18" />
        </div>
        <div className="flex w-full justify-end xl:pr-30">
          <Link to={"/chat"}>
            <img
              src="message.png"
              alt=""
              className="w-10 h-10 hover:w-11 hover:h-11 active:w-9 active:h-9"
            />
          </Link>
        </div>
      </div>
      <div className="h-100  w-full flex flex-wrap  mb-4 justify-center">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:pl-30 xl:pr-30   gap-3.5 sm:gap-5 h-full  ">
          {Object.entries(posts).map(([key, postItem]) => (
            <Post
              key={key}
              postItem={postItem}
              postKey={key}
              sameUser={actualuser1 === postItem.publisherDetails.username}
            />
          ))}
        </div>

        {loading || singlePostopen ? <></> : <Nav />}
      </div>
    </div>
  );
}
