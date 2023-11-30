import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import NotFoundPage from "./NotFoundPage";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import Cookies from "js-cookie";

const MajstorOglasi = () => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const { username, ready } = useContext(UserContext);
  const [oglasi, setOglasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    axios.get("/majstorOglas/vratiOglaseMajstor",{headers:config}).then((response) => {
      setOglasi(response.data);
    });
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentOglasi = oglasi.slice(startIndex, endIndex);

  if (ready) {
    if (username?.role !== "Majstor") {
      return <NotFoundPage />;
    } else {
      return (
        <>
          <div className="flex justify-center">
            <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-1 lg:grid-cols-2">
              {currentOglasi.length > 0 &&
                currentOglasi.map((oglas) => (
                  <Link
                    key={oglas._id}
                    to={"/oglasMajstor/" + oglas._id}
                    className="nav-link-hover"
                  >
                    <div className="bg-gray-500 mb-2 rounded-2xl flex max-w-[768px] h-[432px]">
                      {oglas.putanja_slike?.[0] && (
                        <img
                          className="rounded-2xl object-cover aspect-[16/9]"
                          src={`http://localhost:3500/uploads/${oglas.putanja_slike[0]}`}
                          alt=""
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="text-sm truncate leading-4">{oglas.ime}</h2>
                      <h3 className="font-bold">{oglas.adresa}</h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            {oglasi.length > 0 && (
              <nav>
                <ul className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(oglasi.length / itemsPerPage) }).map((_, index) => (
                    <li key={index}>
                      <button
                        className={`px-3 py-2 rounded-full ${
                          currentPage === index + 1 ? "bt-background text-white" : ""
                        }`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </>
      );
    }
  } else {
    return <LoadingPage />;
  }
};

export default MajstorOglasi;