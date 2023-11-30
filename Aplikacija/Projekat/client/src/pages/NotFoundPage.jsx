import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center">
        <img
          src="http://localhost:5173/src/assets/gifovi/ezgif.com-crop (1).gif"
          alt=""
        />
        <p className="text-3xl text404">Stranica koju tražite nije pronađena</p>
        <Link to={"/"} className="text-2xl textvracanje404 underline">
          Vrati me na glavu stranicu
        </Link>
      </div>
    </div>
  );
};
export default NotFoundPage;
