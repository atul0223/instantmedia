import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";

export default function CreateGroup() {
  const [pageOneOpen, setPageOneOpen] = useState(true);
  const [pageTwoOpen, setPageTwoOpen] = useState(false);
  const [selectedPeoples,setSelectedPeoples] =useState([])
  const { isCreatingGroup, setIsCreatingGroup, selectedChat } =
    useContext(UserContext);
  const [targetSearch, setTargetSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const handleSearch = async (e) => {
    setTargetSearch(e.target.value);

    const res = await axios
      .get(`${BACKENDURL}/home/search`, {
        params: { query: e.target.value },
        withCredentials: true,
      })

      .catch((err) => console.log(err));
    console.log(res.data);

    setSearchData(res.data);
  };
   return (
    <div>
      {pageOneOpen ? (
    
          <div className="col-span-2 w-full h-screen bg-blue-200  ">
            <div className="flex p-4">
              {" "}
              <img
                src="/arrow.png"
                alt=""
                className="w-8 h-8 hover:bg-gray-500 rounded     active:bg-gray-500 active:w-9 active:h-9"
                onClick={() => {}}
              />
              <div className="font-serif mt-1 ml-3 ">Add group members</div>
              <div className="w-full mt-1 items-center flex justify-end"><button className="btn btn-outline-success" onClick={()=>{setPageOneOpen(false);setPageTwoOpen(true)}}>Next</button></div>
            </div>

            <div className="flex items-center ml-7 mb-2 mr-10">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow border-b border-neutral-800 focus:outline-none "
                value={targetSearch}
                onChange={handleSearch}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto w-full h-9/11  p-4">
              {searchData.map((item) => {
                return (
                  <div key={item._id} className=" cursor-pointer select-none">
                    <div
                      className={`w-full rounded-2xl pl-3 h-20 hover:bg-blue-100 flex  items-center mb-1 ${selectedPeoples.includes(item._id)?"bg-gray-400":""}` }
                      key={searchData._id}
                      onClick={()=>setSelectedPeoples((prev )=>prev.includes(item._id)? prev.filter(id => id !== item._id) : [...prev, item._id])}
                    >
                      <div className="w-12 h-12 rounded-full">
                        {!selectedPeoples.includes(item._id)?<img
                          src={item.profilePic}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/pic.jpg";
                          }}
                          alt=""
                          className="md:w-12 md:h-12 rounded-full w-10 h-10 bg-gray-400"
                        />:<img
                          src="/check-mark.png"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/pic.jpg";
                          }}
                          alt=""
                          className="md:w-12 md:h-12 rounded-full w-10 h-10 bg-gray-400"
                        />}
                      </div>
                      <div className="ml-3">
                        <div className="font-serif">@{item.username}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
    
      ) : (
        <div>hello</div>
      )}
    </div>
  );
}
