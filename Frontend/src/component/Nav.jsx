import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaBell, FaUser, FaPlus } from "react-icons/fa";
import UserContext from "../context/UserContext";
import { useRef } from "react";
import axios from "axios";
import { BACKENDURL } from "../config";
export default function Nav() {
  const { actualuser1, setSelectedPost } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [notificationActive, setNotificationActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [targetSearch, setTargetSearch] = useState("");
  const handlePickPhoto = () => {
    fileInputRef.current.click();
  };
  const handleAccept = async (username) => {
    const res = await axios
      .post(
        `${BACKENDURL}/user/handleRequest/${username}`,
        {
          doAccept: true,
        },
        {
          withCredentials: true,
        }
      )
      .catch((err) => console.log(err));
    console.log(res);
  };
  const handleReject = async (username) => {
    const res = await axios
      .post(
        `${BACKENDURL}/user/handleRequest/${username}`,
        {
          doAccept: false,
        },
        {
          withCredentials: true,
        }
      )
      .catch((err) => console.log(err));
    console.log(res);
  };
  const handleNotifications = async () => {
    setNotificationActive(true);
    const res = await axios
      .get(`${BACKENDURL}/home/Notifications`, {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    console.log(res);

    setNotifications(res.data.notifications);
  };
  const handleSearch = async (e) => {
    setTargetSearch(e.target.value);

    const res = await axios
      .get(`${BACKENDURL}/home/search`, {
        params: { query: e.target.value },
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    console.log(res);

    setData(res.data);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Picked file:", file.name);
      setSelectedPost(file);
      navigate("/upload");
    }
  };
  const openSearch = async () => {
    setSearching(true);
  };

  const navigate = useNavigate();
  if (notificationActive) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-baseline justify-center pt-2 ">
        <div className="fixed bottom-4 w-82 bg-zinc-100 shadow-lg z-50 rounded-full ">
          <div className="flex justify-between items-center px-6 py-3 relative">
            <h5 className="ml-18 mt-1 font-serif">Notifications</h5>
            <img
              src="close.png"
              alt=""
              className="w-6 h-6 ml-5 mb-1 hover:h-5 hover:w-5"
              onClick={() => setNotificationActive(false)}
            />
          </div>
        </div>
        <div className="fixed bottom-23">
          {notifications &&
            notifications.slice(0, 8).map((result) => {
              return (
                <Link
                  to={`/profile?user=${result.requester.username}`}
                  key={result._id}
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    setNotificationActive(false);
                  }}
                  targetuser={result.requester.username}
                >
                  <div className="flex w-82 rounded-full bg-blue-200 m-1 shadow-2xl shadow-black">
                    <img
                      src={result.requester.profilePic}
                      alt=""
                      className="w-8 h-8 rounded-full ml-4 mr-2 mt-3 mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg";
                      }}
                    />
                    <div className="mt-1 flex items-center">
                      <h6 className=" text-black">
                        @{result.requester.username}
                      </h6>
                    </div>
                    <div className="font-serif text-black flex items-center">
                      {result.requestStatus === "accepted" ? (
                        <div className="mt-3">
                          {" "}
                          <p className="ml-1">Started following you</p>
                        </div>
                      ) : (
                        <div className="ml-1">
                          <small className="mr-10">wants to follow you</small>{" "}
                          <button
                            className="btn btn-outline-success"
                            onClick={() => {
                              handleAccept(result.requester.username);
                            }}
                          >
                            accept
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              handleReject(result.requester.username);
                            }}
                          >
                            reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    );
  }
  if (searching) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-baseline justify-center pt-2 ">
        <div className="fixed top-4 w-82 bg-zinc-100 shadow-lg z-50 rounded-full ">
          <div className="flex justify-between items-center px-6 py-3 relative">
            <input
              type="text"
              className="h-10 w-full rounded-3xl border-2 p-3"
              placeholder="Search people"
              value={targetSearch}
              onChange={handleSearch}
              autoFocus
            />
            <img
              src="close.png"
              alt=""
              className="w-6 h-6 ml-5 mb-1 hover:h-5 hover:w-5"
              onClick={() => setSearching(false)}
            />
          </div>
        </div>
        <div className="mt-23">
          {targetSearch &&
            data.slice(0, 5).map((result) => {
              return (
                <Link
                  to={`/profile?user=${result.username}`}
                  key={result._id}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="flex w-82 rounded-full bg-blue-200 m-1 shadow-2xl shadow-black"
                    onClick={() => {
                      setSearching(false);
                    }}
                  >
                    <img
                      src={result.profilePic}
                      alt=""
                      className="w-10 h-10 rounded-full m-3 "
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://res.cloudinary.com/dubvb4bha/image/upload/v1752772121/s6njjrsqysstlxneccxw.jpg";
                      }}
                    />

                    <p className="mt-4 text-black">
                      @{result.username} {`(${result.fullName})`}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="sticky bottom-4 w-82 bg-zinc-100 shadow-lg z-50 rounded-full m-auto">
        <div className="flex justify-between items-center px-10 py-6 relative">
          {/* Navigation Icons */}
          <FaHome
            className="text-xl text-gray-600 hover:text-black"
            onClick={() => navigate("/home")}
          />
          <FaSearch
            className="text-xl text-gray-600 hover:text-black mr-15 "
            onClick={openSearch}
          />

          {/* Floating Action Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 rounded-full overflow-hidden bg-black">
            <button
              onClick={handlePickPhoto}
              className="text-white p-4 rounded-full shadow-xl hover:bg-blue-600 transition duration-300"
            >
              <FaPlus />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <FaBell
            className="text-xl text-gray-600 hover:text-black"
            onClick={handleNotifications}
          />
          <Link to={`https://localhost:5173/profile?user=${actualuser1}`}>
            {" "}
            <FaUser className="text-xl text-gray-600 hover:text-black" />
          </Link>
        </div>
      </div>
    );
  }
}
