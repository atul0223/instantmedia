import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaBell, FaUser, FaPlus } from "react-icons/fa";
import UserContext from "../context/UserContext";
import { useRef } from "react";
import axios from "axios";
import { BACKENDURL } from "../config";
export default function Nav() {
  const { currentUserName, setSelectedPost } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [targetSearch, setTargetSearch] = useState("");
  const handlePickPhoto = () => {
    fileInputRef.current.click();
  };
  const handleSearch = async (e) => {
    setTargetSearch(e.target.value);

    const res = await axios
      .get(`${BACKENDURL}/home/search`, {
        params: { query: e.target.value },
        withCredentials: true,
      })
      .catch((err) => console.log(err));
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
            data.map((result) => {
              return (
                <div
                  className="flex w-82 rounded-full bg-blue-200 m-1 shadow-2xl shadow-black"
                  key={result._id}
                  onClick={() => {
                    navigate(`/profile?user=${result.username}`);
                    setSearching(false);
                  }}
                >
                  <Link>
                    <img
                      src={result.profilePic}
                      alt=""
                      className="w-10 h-10 rounded-full m-3 "
                    />
                  </Link>

                  <Link className="mt-4">{result.username}</Link>
                </div>
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

          <FaBell className="text-xl text-gray-600 hover:text-black" />
          <FaUser
            className="text-xl text-gray-600 hover:text-black"
            onClick={() => navigate(`/profile?user=${currentUserName}`)}
          />
        </div>
      </div>
    );
  }
}
