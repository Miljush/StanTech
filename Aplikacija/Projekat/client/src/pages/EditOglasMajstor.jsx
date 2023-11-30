import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Dodaci from "./Dodaci";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import axios from "axios";

const EditOglasMajstor = ({ oglas, izmenjen,setIzmenjen }) => {
  const [brojSoba, setBrojSoba] = useState();
  const [ime, setIme] = useState("");
  const [adresa, setAdresa] = useState("");
  const [dodateSlike, setDodateSlike] = useState([]);
  const [slikaLink, setSlikaLink] = useState("");
  const [opis, setOpis] = useState("");
  const { username } = useContext(UserContext);
  const [usernameStanara, setUsernameStanara] = useState("");
  const[redirectOglasi,setRedirectOglasi] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    setIme(oglas.ime);
    setAdresa(oglas.adresa);
    setDodateSlike(oglas.putanja_slike);
    setOpis(oglas.opis);
  }, [oglas,redirectOglasi]);
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`,
  };
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
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
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
        } else return true;
      }

    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
    }
  };
  const izmeniOglas = async (ev) => {
    ev.preventDefault();
    const provera = await fetchCoordinates();
    if (provera == true) {
      const oglasData = {
        id:`${oglas._id}`,
        ime,
        opis,
        adresa,
        usernameStanara,
        putanja_slike: dodateSlike,
        usernameStanodavca: username.username,
      };
      const { data } = await axios.put(
        "/majstorOglas/azurirajOglasMajstor",
        oglasData,
        { headers: config }
      );
      setIzmenjen(!izmenjen);
      setRedirectOglasi(true);
    } else {
      handleShow();
    }
  };
  if(redirectOglasi){
    return <Navigate to={"/account"}/>;
  }
  else return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Problem sa adresom</Modal.Title>
        </Modal.Header>
        <Modal.Body>Adresa koju pokušavate da unesete nije validna</Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary bt-background"
            variant="secondary"
            onClick={handleClose}
          >
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <form onSubmit={izmeniOglas}>
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
            {dodateSlike?.length > 0 &&
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
    </div>
  );
};

export default EditOglasMajstor;
