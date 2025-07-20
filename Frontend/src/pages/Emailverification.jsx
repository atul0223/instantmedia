import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { BACKENDURL } from "../config.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [isVerified, setIsVerified] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Run verification via token
  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/user/verify/${token}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setMessage("✅ Email verified successfully");
          setIsVerified(true);
        } else {
          setMessage("❌ Email verification failed. Please try again.");
        }
      } catch (error) {
        setMessage("❌ Invalid or expired token");
      }
    };

    verifyEmail();
  }, [token]);

  // Poll if no token and not verified
  useEffect(() => {
    if (token || isVerified) return;

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
            setMessage("✅ Email verified");
            await delay(1000);
            navigate("/");
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
  }, [isVerified, token, navigate]);

  // Single JSX return block
  return (
    <div className="h-screen w-screen flex justify-center bg-blue-200">
      <div className="w-full h-full sm:w-fit sm:h-fit sm:border-b-blue-600 sm:p-20 p-20 sm:rounded-4xl bg-blue-100">
        <div>
          <h3>{isVerified ? "✅ Email verified successfully" : message}</h3>
          <div className="mt-10">
            {isVerified ? (
              <h5>Email verified ✅</h5>
            ) :<div> (
              <ClipLoader color="#36d7b7" size={50} className="sm:ml-40" />
            )</div>}
          </div>
        </div>
      </div>
    </div>
  );
}