import React from "react";
import { Link } from "react-router-dom";
const OglasMajstorComponent = ({ oglas, key }) => {
  return (
    <div className="flex items-center w-full">
      <Link
        className="text-2xl flex flex-col sm:flex-row nav-link-hover"
        to={`/oglasMajstor/${oglas?._id}`}
      >
        <div>
          {oglas?.putanja_slike && (
            <img
              className="rounded-md border-4 border-green-400 object-cover aspect-square"
              style={{ height: "200px", width: "200px" }}
              src={`http://localhost:3500/uploads/${oglas?.putanja_slike[0]}`}
              alt={oglas.putanja_slike}
            />
          )}
        </div>
        <div className="pl-7">
          <p>{oglas?.ime}</p>
          <p>{oglas?.adresa}</p>
        </div>
      </Link>
    </div>
  );
};
export default OglasMajstorComponent;
