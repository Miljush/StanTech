import React from "react";
import { Link } from "react-router-dom";
const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center">
        <img
          src="http://localhost:5173/src/assets/gifovi/loadin_gif (1).gif"
          alt=""
        />
      </div>
    </div>
  );
};
export default LoadingPage;
