import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { BACKENDURL } from "../config.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const [isVerified, setIsVerified] = useState(false);
if (condition) {
  
}
  useEffect(() => {
    let cancelled = false;

    const checkVerification = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        console.error("Username not found in localStorage");
        return;
      }

      while (!cancelled && !isVerified) {
        await delay(5000);
        try {
          const res = await axios.get(`${BACKENDURL}/user/isemailVerified/${username}`, {
            withCredentials: true,
          });
          
          
          if (res.data.isVerified) {
            setIsVerified(true);
            delay(1000).then(() => {
              navigate("/");
            });
           
          }
        } catch (error) {
          console.error("Verification check failed:", error);
        }
      }
    };

    checkVerification();

    return () => {
      cancelled = true;
    };
  }, [isVerified]);

  return (
    <div className="h-screen w-screen flex justify-center bg-blue-200">
      <div className="w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 sm:p-20 p-20 sm:rounded-4xl bg-blue-100">
        <div>
          {isVerified ? <h1>Success !!</h1> : <h3>!! Email verification pending !!</h3>}
          <div className="mt-10">
            {isVerified ? (
              <h5>Email verified ✅</h5>
            ) : (
              <ClipLoader color="#36d7b7" size={50} className="sm:ml-40" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}