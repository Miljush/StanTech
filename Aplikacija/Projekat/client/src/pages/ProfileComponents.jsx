import React from "react";
import { Link } from "react-router-dom";
const ProfileComponents = ({ user }) => {
  return (
    <div className="flex  items-center">
      <Link
        className="text-2xl  flex nav-link-hover flex flex-col sm:flex-row"
        to={`/profile/${user.username}`}
      >
        <div style={{ height: "100px", width: "100px" }}>
          {user?.slika && (
            <img
              className="rounded-full border-4 border-green-400 object-cover"
              style={{ height: "100px", width: "100px" }}
              src={`http://localhost:3500/uploads/${user?.slika}`}
              alt={user.slika}
            />
          )}
        </div>
        <div className="pl-7">
          <div className="flex">
            <p>{user.ime}</p>
            <p>&nbsp;</p>
            <p className="prezime">{user.prezime}</p>
          </div>
          <p>{user.username}</p>
          <p className="prezime">{user.brtelefona}</p>
        </div>
      </Link>
    </div>
  );
};
export default ProfileComponents;
