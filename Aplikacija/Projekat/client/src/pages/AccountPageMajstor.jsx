import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import StanarInfo from "./StanarInfo";
import Calendar from "./Calendar";
import { Input } from "@mui/material";
import ProfileComponents from "./ProfileComponents";
import Cookies from "js-cookie";

const AccountPageMajstor = () => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const { username } = useContext(UserContext);
  const [stanari, setStanari] = useState([]);
  const [stanar, setStanar] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [classNameStanari, setClassNameStanari] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [classNameIzmeni, setClassNameIzmeni] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [prikaziStanare, setPrikaziStanare] = useState(false);

  useEffect(() => {
    async function fetchStanariList() {
      try {
        const stanariList = await axios.get("/majstor/vratiBrojTelefona", {
          headers:config,
          params: { idMajstora: username._id,
            datum: selectedDate, },
        });
        stanariList.data.map((stanar)=>{stanar.brtelefona=stanar.brojTelefonaStanara})
        setStanari(stanariList.data);
        console.log(stanariList.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStanariList();
  }, [selectedDate, username._id]);
  async function handleButtonDodaj() {
    try {
      const stanariList = await axios.post("/majstor/kreirajKalendar", {
        datum: selectedDate,
        majstorId: username._id,
        username: stanar,
      },{headers:config});
      setStanari(stanariList);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }
  const handleButtonStanari = () => {
    setClassNameIzmeni("p-2 m-2 bg-white w-md rounded-full");
    if (
      classNameStanari == "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
    ) {
      setClassNameStanari(
        "p-2 m-2 bg-gray w-md rounded-full inline-flex gap-1"
      );
    } else {
      setClassNameStanari(
        "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
      );
    }
    setPrikaziStanare(!prikaziStanare);
  };

  const handleButtonIzmeni = () => {
    setClassNameStanari("p-2 m-2 bg-white w-md rounded-full");
    setClassNameIzmeni(" m-2 bg-gray w-md rounded-full p-2");
    setPrikaziStanare(false);
  };
  return (
    <div>
      <nav className="w-full-flex">
        <button className={classNameStanari} onClick={handleButtonStanari}>
          Popravke
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        </button>
      </nav>
      {prikaziStanare ? (
        <div>
          <p className="text-l text-gray-600 mb-1">
            Proverite datum posla ili dodajte dogovoreni posao kod stanara:
          </p>
          <Calendar onDateChange={handleDateChange} />
          <textarea
            className=""
            value={stanar}
            onChange={(ev) => setStanar(ev.target.value)}
            placeholder="Username Stanara"
          ></textarea>
          <button
            className="p-1 bg-gray-200 px-4 rounded-2xl mb-4 justify-center"
            onClick={handleButtonDodaj}
          >
            Dodaj
          </button>
          <p className="text-xl text-gray-700 font-semibold mb-4">
            Stanari zakazani za ovaj datum:
          </p>
          {stanari.length > 0 ? (
            stanari.map((stanar) => (
              <div key={stanar.username}>
                <ProfileComponents user={stanar} />
              </div>
            ))
          ) : (
            <p className="text-xl text-gray-700 font-semibold mb-4">
              Nema stanara za ovaj datum.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AccountPageMajstor;
