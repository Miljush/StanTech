import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Dodaci from "./Dodaci";
import axios from "axios";
import { UserContext } from "../UserContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from "js-cookie";

const OglasStanPage = ({dodato , setDodato}) => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { action } = useParams();
  const [brojSoba, setBrojSoba] = useState();
  const [ime, setIme] = useState("");
  const [adresa, setAdresa] = useState("");
  const [dodateSlike, setDodateSlike] = useState([]);
  const [slikaLink, setSlikaLink] = useState("");
  const [opis, setOpis] = useState("");
  const [tipGrejanja, setTipGrejanja] = useState("");
  const [dodaci, setDodaci] = useState([]);
  const { username } = useContext(UserContext);
  const [redirectOglasi, setRedirectOglasi] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [povrsina,setPovrsina] = useState(null);
  const [cena,setCena] = useState(null);
  async function dodajSlikuLink(ev) {
    ev.preventDefault();
    try {
      const { data: fileName } = await axios.post("/dodaj-sliku-link", {
        link: slikaLink,
      });
      console.log(fileName);
      setDodateSlike((prev) => {
        return [...prev, fileName];
      });
      setSlikaLink("");
    } catch (err) {
      console.log(err);
    }
  }
  const izbrisiSliku=async (link,event)=>{
    event.preventDefault();
    const filteredArray = dodateSlike.filter((element) => element !== link);
    setDodateSlike(filteredArray);
    await axios.post("/deleteFileInFolder",{link});
  }
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/dodaj", data, {
        headers: { "Content-type": "multipart/form-data",Authorization: `Bearer ${Cookies.get("token")}`},
       
      })
      .then((response) => {
        const { data: filenames } = response;
        setDodateSlike((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${adresa}`
        )}&format=json`,
        {
          headers: {
            "x-requested-with": "XMLHttpRequest",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (parseFloat(lat) == 23.216145599999997) {
          return false;
        }
        else
          return true;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
    }
  };

  async function dodajNoviOglas(ev) {
    ev.preventDefault();
    const provera=await fetchCoordinates();
    if(provera==true)
    {
    const oglasData = {
      ime,
      adresa,
      dodateSlike,
      opis,
      dodaci,
      brojSoba,
      tipGrejanja,
      cena,
      povrsina,
      putanja_slike: dodateSlike,
      usernameStanodavca: username.username,
    };
    setRedirectOglasi(true);
    const { data } =await axios.post("/stanOglas/kreirajOglasStan", oglasData,{headers:config});
    setDodato(!dodato); 
    }
    else{
      handleShow();
    }
  }
  if (redirectOglasi && action !== "new") {
    return <Navigate to={"/account"} />;
  }
  function cancelButton(){
    return <Navigate to={"/account"}/>;
  }
  
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Problem sa adresom</Modal.Title>
        </Modal.Header>
        <Modal.Body>Adresa koju pokušavate da unesete nije validna</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
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
            <p className="text-black-500">Adresa</p>
            <input
              type="text"
              value={adresa}
              onChange={(ev) => setAdresa(ev.target.value)}
              placeholder="Ulica broj Grad"
            />
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
            <p className="text-black-500">Povrsina stana</p>
            <input
              type="number"
              value={povrsina}
              onChange={(ev) => setPovrsina(ev.target.value)}
              placeholder="Broj kvadrata (m²)"
              className="rounded-full p-2 border border-gray-300 mb-2 mt-1"
            />
             <p className="text-black-500">Cena mesecne kirije</p>
            <input
              type="number"
              value={cena}
              onChange={(ev) => setCena(ev.target.value)}
              placeholder="Cena (€)"
              className="rounded-full p-2 border border-gray-300 mb-2 mt-1"
            />
            <p className="text-black-500">Opis</p>
            <textarea
              className=""
              value={opis}
              onChange={(ev) => setOpis(ev.target.value)}
              placeholder="Opis oglasa, neke generalne stavke..."
            ></textarea>
            <div>
              <label htmlFor="brojSoba" className="block text-md mb-2">
                Izaberite broj soba u stanu:
              </label>
              <select
                id="brojSoba"
                name="brojSoba"
                value={brojSoba}
                onChange={(ev) => setBrojSoba(ev.target.value)}
                className="block w-full border rounded-md py-2 px-3 mb-4"
              >
                <option value="">Izaberite broj soba u stanu</option>
                <option value="garsonjera">Garsonjera</option>
                <option value="jednosoban">Jednosoban</option>
                <option value="jednoiposoban">Jednoiposoban</option>
                <option value="dvosoban">Dvosoban</option>
                <option value="dvoiposoban">Dvoiposoban</option>
                <option value="trosoban">Trosoban</option>
                <option value="troiposoban">Troiposoban</option>
                <option value="cetvorosoban">Cetvorosoban</option>
                <option value="visesoba">4.5 ili vise soba</option>
              </select>
            </div>
            <div>
              <label htmlFor="brojSoba" className="block text-md mb-2">
                Izaberite tip grejanja u stanu:
              </label>
              <select
                id="tipGrejanja"
                name="tipGrejanja"
                value={tipGrejanja}
                onChange={(ev) => setTipGrejanja(ev.target.value)}
                className="block w-full border rounded-md py-2 px-3 mb-4"
              >
                <option value="">Izaberite tip grejanja u stanu</option>
                <option value="centralno">Centralno</option>
                <option value="tapec">TA Pec</option>
                <option value="gas">Na gas</option>
                <option value="etazno">Etazno</option>
                <option value="kraljevskapec">Kraljevska pec</option>
                <option value="norveskiradijatori">Norveski radijatori</option>
                <option value="podno">Podno</option>
                <option value="struja">Na struju</option>
              </select>
            </div>
            <h2 className="text-2xl mt-4">Dodatni sadrzaj</h2>
            <p className="text-gray-500 text-sm">Izaberite dodatni sadrzaj</p>
            <Dodaci selected={dodaci} onChange={setDodaci} />
            <div>
              <button className="primary my-4">Sacuvaj</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OglasStanPage;
