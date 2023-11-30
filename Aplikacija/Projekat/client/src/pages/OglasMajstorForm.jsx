import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import Cookies from "js-cookie";

const OglaMajstorForm = ({ dodato, setDodato }) => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`,
  };
  const { action } = useParams();
  const [ime, setIme] = useState("");
  const [dodateSlike, setDodateSlike] = useState([]);
  const [slikaLink, setSlikaLink] = useState("");
  const [opis, setOpis] = useState("");
  const { username } = useContext(UserContext);
  const [usernameStanara, setUsernameStanara] = useState("");
  const [redirectOglasi, setRedirectOglasi] = useState(false);
  const [adresa, setAdresa] = useState("");
  const [sviStanari, setSviStanari] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    const fetchData = async ()=>{const { data } = await axios.get("/stanodavac/vratiListuStanara", {
      headers: config,
      params:{idstanodavca:username._id}
    });
    setSviStanari(data);
  }
  fetchData();
  }, []);
  const izbrisiSliku=async (link,event)=>{
    event.preventDefault();
    const filteredArray = dodateSlike.filter((element) => element !== link);
    setDodateSlike(filteredArray);
    await axios.post("/deleteFileInFolder",{link});
  }
  async function dodajSlikuLink(ev) {
    ev.preventDefault();
    try {
      const { data: fileName } = await axios.post("/dodaj-sliku-link", {
        link: slikaLink,
      });
      setDodateSlike((prev) => {
        return [...prev, fileName];
      });
      setSlikaLink("");
    } catch (err) {
      console.log(err);
    }
  }
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/dodajmajstor", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setDodateSlike((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  async function dodajNoviOglas(ev) {
    ev.preventDefault();
    let oglasData;
    const stanar = sviStanari[0].username;
    if(selectedValue==""){
      console.log("udjosmo");
      oglasData = {
        ime,
        opis,
        adresa,
        usernameStanara:stanar,
        putanja_slike: dodateSlike,
        usernameStanodavca: username.username,
      };
    }
    else{
      oglasData = {
        ime,
        opis,
        adresa,
        usernameStanara:selectedValue,
        putanja_slike: dodateSlike,
        usernameStanodavca: username.username,
      };
    }
    
    setRedirectOglasi(true);
    await axios.post(
      "/majstorOglas/kreirajOglasMajstor",
      oglasData,
      { headers: config }
    ).catch((err)=>{console.error(err)});
    setDodato(!dodato);
  }
  if (redirectOglasi && action !== "new") {
    return <Navigate to={"/account/oglasiMajstor"} />;
  }
  function cancelButton() {
    return <Navigate to={"/account/oglasiMajstor"} />;
  }

  return (
    <div>
      {action !== "dodaj" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-green-500 text-white py-2 px-6 rounded-full "
            to={"/account/oglasi/dodaj"}
          >
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Dodaj novi oglas
          </Link>
        </div>
      )}
      {action === "dodaj" && (
        <div>
          <div className="flex justify-end">
            <Link className="bg-white" to={"/account/oglasi"}>
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
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
          </div>
          <form onSubmit={dodajNoviOglas}>
            <p className="text-black-500">Ime oglasa</p>
            <input
              type="text"
              value={ime}
              onChange={(ev) => setIme(ev.target.value)}
              placeholder="Ime oglasa"
            />
            <p className="text-black-500">Adresa stana</p>
            <input
              type="text"
              value={adresa}
              onChange={(ev) => setAdresa(ev.target.value)}
              placeholder="Ulica Broj Grad"
            />
            <p className="text-black-500">Stanar kome je potrebna popravka:</p>
            <select className="rounded-full p-1 border-2 border-gray mb-2" onChange={handleChange}>
              {sviStanari.map((stanar) => (
                <option key={stanar.username} value={stanar.username}>
                  {stanar.username}
                </option>
              ))}
            </select>
            <p className="text-black-500">Slike</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={slikaLink}
                onChange={(ev) => setSlikaLink(ev.target.value)}
                placeholder={"Dodaj preko linka ...jpg"}
              ></input>
              <button
                onClick={dodajSlikuLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Dodaj sliku
              </button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
            {dodateSlike.length > 0 &&
                dodateSlike.map((link) => (
                  <div>
                    {link.includes("uploads")? (<div key={link} className="h-32 flex justify-end">
                    <button onClick={()=>{izbrisiSliku(link,event)}} className="absolute bg-transparent "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" class="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                    <img
                      className="rounded-2xl mb-4 w-full object-cover"
                      src={"http://localhost:3500/" + link}
                    ></img>
                  </div>):(<div key={link} className="h-32 flex justify-end">
                    <button onClick={()=>{izbrisiSliku(link,event)}} className="absolute bg-transparent "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" class="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                    <img
                      className="rounded-2xl mb-4 w-full object-cover"
                      src={"http://localhost:3500/uploads/" + link}
                    ></img>
                  </div>)}
                  
                  </div>
                ))}
              <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                ></input>
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Otpremi
              </label>
            </div>
            <p className="text-black-500">Opis</p>
            <textarea
              className=""
              value={opis}
              onChange={(ev) => setOpis(ev.target.value)}
              placeholder="Opis oglasa, neke generalne stavke..."
            ></textarea>
            <div>
              <button className="primary my-4">Sacuvaj</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OglaMajstorForm;
