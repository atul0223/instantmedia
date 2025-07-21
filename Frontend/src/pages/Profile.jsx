import { useEffect } from "react";
import Post from "../../../Backend/src/component/Post";
import axios from "axios";
import { BACKENDURL } from "../config";

export default function Profile() {
  const user = new URLSearchParams(window.location.search).get("user");
  useEffect(() => {
    const fetchUser =async () => {
      const res =await axios.get(`${BACKENDURL}/profile/${user}`,{withCredentials:true}).then((response) => {
        if (response.status === 200) {
          console.log("User data fetched successfully");
          console.log(response.data);
          
        } else {
          console.error("Failed to fetch user data");
        }
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      }
      );
    };
    fetchUser();
  }, []);
  return (
    <div className="w-screen h-screen bg-blue-100 sm:pl-60 sm:pr-60 pl-4 pr-4">
      <div>
        <div className="h-100  w-full flex flex-wrap justify-center sm:pt-20 pt-20 gap-4  ">
          <div className="rounded-full sm:w-45 sm:h-45 w-30 h-30 overflow-hidden">
            <img src="/pic.jpg" alt="" className="object-cover w-full h-full" />
          </div>
          <div className="w-full flex justify-center ">
            <h5> @username</h5>
          </div>
          <div className="w-full flex justify-center  gap-12 ">
            <div>posts</div>
            <div>followers</div>
            <div>following</div>
          </div>

          <div className="mb-10 flex mt-3 gap-10">
            <button type="button" className="btn btn-primary">
              Follow
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
