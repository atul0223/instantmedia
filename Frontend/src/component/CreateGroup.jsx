import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";
import Loading from "./Loading";

export default function CreateGroup() {
  const [pageOneOpen, setPageOneOpen] = useState(true);
  const [previewPic, setPreviewPic] = useState(null);
    const fileInputRef = useRef(null);
  const [pageTwoOpen, setPageTwoOpen] = useState(false);
  const[GroupName,setGroupName]=useState("")
  const [selectedPeoples,setSelectedPeoples] =useState([])
  const { setIsCreatingGroup,setLoading } =useContext(UserContext);
  const [targetSearch, setTargetSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [selectedPic, setSelectedPic] = useState(null);
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
    console.log(res.data);

    setSearchData(res.data);
  };
const handleCreateGroup = async () => {
  const formData = new FormData();
  formData.append("name", GroupName);
  formData.append("users", JSON.stringify(selectedPeoples)); // stringify array
  formData.append("groupPic", selectedPic);

  setLoading(true);

  try {
    const res = await axios.post(`${BACKENDURL}/chat/creategroup`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Group created:", res.data);
    setIsCreatingGroup(false);
    location.reload();
  } catch (err) {
    console.error("Group creation failed:", err);
  } finally {
    setLoading(false);
  }
};
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedPic(file);
    setPreviewPic(URL.createObjectURL(file)); // create preview URL
  }
};
useEffect(() => {
  return () => {
    if (previewPic) URL.revokeObjectURL(previewPic);
  };
}, [previewPic]);


   return (
    <div>
      <Loading/>
      {pageOneOpen ? (
    
          <div className="col-span-2 w-full h-screen bg-blue-200  ">
            <div className="flex p-4">
              {" "}
              <img
                src="/arrow.png"
                alt=""
                className="w-8 h-8 hover:bg-gray-500 rounded     active:bg-gray-500 active:w-9 active:h-9"
                onClick={() => {setIsCreatingGroup(false)}}
              />
              <div className="font-serif mt-1 ml-3 ">Add group members</div>
             {selectedPeoples.length<2 ? <></>:<div className="w-full mt-1 items-center flex justify-end"><button className="btn btn-outline-success" onClick={()=>{setPageOneOpen(false);setPageTwoOpen(true)}}>Next</button></div>
}</div>

            <div className="flex items-center ml-7 mb-2 mr-10">
              <input
                type="text"
                placeholder="Search @users"
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
        <div className="col-span-2 w-full h-screen bg-blue-200  ">
               <div className="flex p-4 items-center">
       
              <img
                src="/arrow.png"
                alt=""
                className="w-8 h-8 hover:bg-gray-500 rounded    active:bg-gray-500 active:w-9 active:h-9"
                onClick={() => {setPageTwoOpen(false); setPageOneOpen(true)}}
              />
              <div className="font-serif  ml-3 w-full h-full  ">Set Group details</div>
            {GroupName?<div className="w-full mt-1  items-center flex justify-end"><button className="btn btn-outline-success"onClick={handleCreateGroup} >Create </button></div>:<> </>
}
              </div><div className="w-full h-6 flex justify-center mt-10 relative">
  <img
    src={previewPic || "/group-chat.png"}
    alt="Group Preview"
    className="object-cover w-45 h-45 rounded-full bg-gray-700"
  />
  <div className="mt-35 " onClick={handlePickPhoto}>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
    <img
      src="edit.png"
      alt="Edit"
      className="w-5 h-5 hover:w-6 hover:h-6 active:w-4 active:h-4 z-10"
    />
  </div>
</div>

        < div className="flex items-center ml-7 mt-55 mr-4">
              <input
                type="text"
                placeholder="Group Objective"
                className="flex-grow border-b border-neutral-800 focus:outline-none "
                value={GroupName}
                onChange={(e)=>setGroupName(e.target.value)}
                autoFocus
              />
            </div>
            
        </div>
      )}
    </div>
  );
}
