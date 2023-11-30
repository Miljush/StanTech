import React, { useState } from "react";

const OglasStanSearchBar = ({ onSearch }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const options = [
    "Garsonjera",
    "Jednosoban",
    "Jednoiposoban",
    "Dvosoban",
    "Dvoiposoban",
    "Trosoban",
    "Troiposoban",
    "Cetvorosoban",
    "4.5 ili više soba",
  ];
  const handleSearch = () => {
    const searchResult = {
      selectedOption,
      price,
      area,
      location,
    };
    onSearch(searchResult);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center">
        <div className="text-sm sm:text-base flex flex-wrap w-full max-w-4xl">
          <div className=" w-1/4 px-2 mb-4">
            <label className="block mb-2">Broj_soba:</label>
            <select
              className="w-full px-4 py-2 border rounded mt-2"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Svi stanovi</option>
              {options.map((option) => (
                <option
                  className={`${option === selectedOption ? 'bg-green-500 text-white' : ''} hover:bg-green-500 !important`}
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4 px-2 mb-4">
            <label className="block mb-2">Cena_do:</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="w-1/4 px-2 mb-4">
            <label className="block mb-2">Površina:</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="w-1/4 px-2 mb-4">
            <label className="block mb-2">Lokacija:</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full px-2">
            <button
              className="w-full px-4 py-2 text-white bg-green-500 rounded flex justify-center"
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Pretraži
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OglasStanSearchBar;
