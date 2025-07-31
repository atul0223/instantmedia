import React, { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { BACKENDURL } from "../config";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
export default function AddPost() {
  const [preview, setPreview] = useState(null);
  const { selectedPost ,currentUserName,loading,setLoading} = useContext(UserContext);
const navigate =useNavigate()
  const [title, setTitle] = useState("");
const handleUpload = async () => {
  setLoading(true)
  if (!selectedPost) {
    alert("Please select a picture before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("post", selectedPost); // key should match multer's .single("post")
  formData.append("title", title);

  try {
    await axios.post(`${BACKENDURL}/profile/post`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    navigate(`/profile?user=${currentUserName}`)
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed. Please try again.");
  }
  setLoading(false)
};


  
useEffect(() => {
  setLoading(true)
  if (selectedPost) {
    const objectUrl = URL.createObjectURL(selectedPost);
    setPreview(objectUrl);
    setLoading(false)
    return () => URL.revokeObjectURL(objectUrl); // cleanup

  }
}, [selectedPost]);

if (selectedPost) {
   return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-blue-200">
      <Loading/>
      <div className="flex justify-center w-full min-h-screen sm:min-h-full sm:w-fit sm:border-b-blue-600 sm:pl-30 sm:pr-30  p-10 sm:rounded-2xl bg-blue-100">
        <div>
          {preview && (
            <div className="w-full  h-full ">
              <div>
                <h5>preview</h5>
              </div>
              <div className="mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="sm:w-70 sm:h-90 w-40 h-60 rounded border "
                />
              </div>
              <div className="mb-4">
                <div class="form-group">
                  <label for="title">Title</label>
                  <textarea
                    class="form-control"
                    id="title"
                    rows="3"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center border-2 rounded-3xl w-40 hover:w-41" >
                <h4 className="mt-1 -z-0"  onClick={handleUpload}>Upload </h4>
                <img
                  src="upload.png"
                  alt=""
                  className="w-10 h-10 hover:w-10 hover:h-10 ml-4"
                  onClick={handleUpload}
                  
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
else{
  return <h3>bad Url</h3>
}
}
 