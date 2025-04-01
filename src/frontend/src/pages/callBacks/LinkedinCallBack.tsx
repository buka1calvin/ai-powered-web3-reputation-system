import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLinkedInCallback } from "../../api/linkedin";

const LinkedInCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleLinkedInCallback();
        // Redirect will happen in the handleLinkedInCallback function
      } catch (err) {
        console.error("LinkedIn callback error:", err);
        setError("Failed to authenticate with LinkedIn. Please try again.");
        // Redirect to profile creation page after a delay
        setTimeout(() => {
          navigate("/profile/create", { replace: true });
        }, 7000);
      }
    };

    processCallback();
  }, [navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Authenticating with LinkedIn</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4">Please wait while we connect your LinkedIn account...</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;