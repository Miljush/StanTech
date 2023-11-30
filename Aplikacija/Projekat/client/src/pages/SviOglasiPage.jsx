import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import axios from "axios";
import OglasStanSearchBar from "./OglasStanSearchBar";
import LoadingPage from "./LoadingPage";

const SviOglasiPage = () => {
  const [oglasi, setOglasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState(null);
  const [readyStrana, setReadyStrana] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filterType, setFilterType] = useState();
  const [sortiraj, setSortiraj] = useState(false);
  const [promena,setPromena] = useState(false);

  useEffect(() => {
    if (sortiraj==false) {
      axios.get("/stanOglas/vratiDostupneOglase").then((response) => {
        setOglasi(response.data);
        setReadyStrana(true);
      });
    }
  }, [promena]);
  const vidljivost = showSearch ? "" : "hidden";
  const vidljivostDugme = showSearch ? "hidden" : "";
  const startIndex = (currentPage - 1) * 12;
  const endIndex = startIndex + 12;
  const currentOglasi = oglasi.slice(startIndex, endIndex);

  const filteredOglasi = searchResult
    ? oglasi.filter((oglas) => {
        if (
          searchResult.selectedOption &&
          oglas.brojSoba.toLowerCase() !==
            searchResult.selectedOption.toLowerCase()
        ) {
          return false;
        }
        if (searchResult.price && oglas.cena > searchResult.price) {
          return false;
        }
        if (searchResult.area && oglas.povrsina < searchResult.area) {
          return false;
        }
        if (
          searchResult.location &&
          !oglas.adresa.toLowerCase().includes(searchResult.location.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
    : oglasi;
  const filteredCurrentOglasi = filteredOglasi.slice(startIndex, endIndex);
  const handleDugme = () => {
    setShowSearch(!showSearch);
  };
  const handleSearch = (result) => {
    setSearchResult(result);
    setCurrentPage(1);
  };
  const handleFilterChange = (e) => {
    const tempOglasi = [...oglasi];
    setFilterType(e.target.value);
    if (e.target.value == "cenaSilazno") {
      tempOglasi.sort((a, b) => b.cena - a.cena);
    } else if (e.target.value == "cenaUzlazno") {
      tempOglasi.sort((a, b) => a.cena - b.cena);
    } else if (e.target.value == "povrsinaSilazno") {
      tempOglasi.sort((a, b) => b.povrsina - a.povrsina);
    } else if (e.target.value == "povrsinaUzlazno") {
      tempOglasi.sort((a, b) => a.povrsina - b.povrsina);
    }
    setOglasi(tempOglasi);
    setSortiraj(true);
    setPromena(!promena);
  };

  if (!readyStrana) {
    return <LoadingPage />;
  } else
    return (
      <div className="mt-5 pt-2">
        
       <div className="flex items-center -mb-12">
        <div className="w-1/3"></div>
        <div className={`${vidljivostDugme} w-full flex justify-center  "w-1/3"`}>
          <button
            onClick={handleDugme}
            className=" px-4 py-2 text-white bg-green-500 rounded flex items-center gap-2 h-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Pretraži
          </button>
        </div>
        <div className={`flex justify-end w-1/3 ${vidljivostDugme}`}>
          <div>
            <p className="no-wrap">Filtriraj_prema</p>
            <select
              id="filterType"
              name="filterType"
              value={filterType}
              onChange={handleFilterChange}
              className="block w-full border rounded-md py-2 px-3 mb-4"
            >
              <option value=""></option>
              <option value="cenaSilazno">ceni silazno</option>
              <option value="cenaUzlazno">ceni uzlazno</option>
              <option value="povrsinaUzlazno">povrsini uzlazno</option>
              <option value="povrsinaSilazno">povrsini silazno</option>
            </select>
          </div>
        </div>
        </div>
        <div className={`${vidljivost} w-full flex justify-center -mb-5 mt-5`}>
          <button
            onClick={handleDugme}
            className=" px-4 py-2 text-white bg-green-500 rounded flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className={`${vidljivost}`}>
          <OglasStanSearchBar onSearch={handleSearch} />
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCurrentOglasi.length > 0 ? (
            filteredCurrentOglasi.map((oglas) => (
              <Link
                key={oglas._id}
                to={"/oglas/" + oglas._id}
                className="nav-link-hover"
              >
                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                  {oglas.putanja_slike?.[0] && (
                    <img
                      className="rounded-2xl object-cover aspect-square"
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
            ))
          ) : (
            <p>Nema rezultata pretrage.</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          {filteredOglasi.length > 0 && (
            <nav>
              <ul className="flex items-center gap-1">
                {Array.from({
                  length: Math.ceil(filteredOglasi.length / 12),
                }).map((_, index) => (
                  <li key={index}>
                    <button
                      className={`px-3 py-2 rounded-full ${
                        currentPage === index + 1
                          ? "bt-background text-white"
                          : ""
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
      </div>
    );
};

export default SviOglasiPage;
