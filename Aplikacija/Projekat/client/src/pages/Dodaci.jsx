import React, { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";

const Dodaci = ({ selected, onChange }) => {
  const [wifiCheck, setWifiCheck] = useState(null);
  const [parkingCheck, setParkingCheck] = useState(null);
  const [tvCheck, setTvCheck] = useState(null);
  const [klimaCheck, setKlimaCheck] = useState(null);
  useEffect(() => {
    if (selected.includes("wifi")) {
      setWifiCheck(true);
    } else {
      setWifiCheck(false);
    }
    if (selected.includes("televizija")) {
      setTvCheck(true);
    } else {
      setTvCheck(false);
    }
    if (selected.includes("parking")) {
      setParkingCheck(true);
    } else {
      setParkingCheck(false);
    }
    if (selected.includes("klima")) {
      setKlimaCheck(true);
    } else {
      setKlimaCheck(false);
    }
  }, [selected]);
  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }
  if (
    wifiCheck == null ||
    tvCheck == null ||
    klimaCheck == null ||
    parkingCheck == null
  ) {
    return <LoadingPage />;
  } else
    return (
      <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <label className="border p-4 flex rounded-2xl gap-2 items-center">
          <input
          checked={wifiCheck}
            type="checkbox"
            name="wifi"
            onChange={handleCbClick}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
            />
          </svg>

          <span>Wifi</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center">
          <input
            type="checkbox"
            name="parking"
            onChange={handleCbClick}
            checked={parkingCheck}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>

          <span>Parking</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center">
          <input
            type="checkbox"
            name="televizija"
            onChange={handleCbClick}
            checked={tvCheck}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>

          <span>Televizija</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center">
          <input
            type="checkbox"
            name="klima"
            onChange={handleCbClick}
            checked={klimaCheck}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-air-conditioning"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 16a3 3 0 0 1 -3 3"></path>
            <path d="M16 16a3 3 0 0 0 3 3"></path>
            <path d="M12 16v4"></path>
            <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
            <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3"></path>
          </svg>
          <span>Klima</span>
        </label>
      </div>
    );
};

export default Dodaci;
