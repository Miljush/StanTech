import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Loading from "./LoadingPage";
import ProfileComponents from "./ProfileComponents";
import { UserContext } from "../UserContext";
import Slider from "./Slider";
import Cookies from "js-cookie";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const OglasPage = ({ socket }) => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [stanar, setStanar] = useState(false);
  const { username, ready } = useContext(UserContext);
  const { id } = useParams();
  const [oglas, setOglas] = useState([]);
  const [stanodavac, setStanodavac] = useState([]);
  const [prikaziSlike, setPrikaziSlike] = useState(false);
  const [stanarInfo, setStanarInfo] = useState([]);
  useEffect(() => {
    axios.get("/stanOglas/vratiOglas", { params: { id: id } }).then((response) => {
      setOglas(response.data);
    });
    if (username?.role == "Stanar") {
      axios.get("/stanar/vratiStanara", {
        headers:config,
        params: { id: username._id },
      }).then((response)=>{
        setStanar(true);
        setStanarInfo(response.data);
      });
    }
    if (latitude) {
      axios
        .get("/stanOglas/vratiStanodavcaZaOglas", { params: { id: oglas?.stanodavac } })
        .then((response) => {
          setStanodavac(response.data);
        });
    }
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            `${oglas.adresa}`
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
            setLatitude("");
            setLongitude("");
          } else {
            setLatitude(parseFloat(lat));
            setLongitude(parseFloat(lon));
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
    
    fetchCoordinates();
  }, [longitude]);

  async function iznajmiFun() {
    socket.emit("friend-request", {
      idStanara: username.username,
      idStanodavca: stanodavac.username,
    });
    const response = await sendRequest();
    if (response?.data != "") {
      sendNotification();
      handleShow();
    } else {
      handleShow2();
    }
  }
  async function sendNotification() {
    try {
      const sendNotification = await fetch("http://localhost:3500/notify", {
        method: "POST",
        body: JSON.stringify({
          usernameStanara: username.username,
          usernameStanodavca: stanodavac.username,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await sendNotification.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function sendRequest() {
    try {
      const dataRequest = await axios.post("/posaljiZahtev", {
        prima: stanodavac.username,
        salje: username.username,
      });
      return dataRequest;
    } catch (err) {
      console.error(err);
    }
  }

  if (!latitude) {
    return <Loading />;
  } else if (prikaziSlike) {
    return (
      <>
        <div className="flex flex-col pt-12 items-center">
          <button
            onClick={() => setPrikaziSlike(false)}
            className="flex mt-4 -mb-10 rounded-full py-1 px-1 z-50"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Zatvori Slike
          </button>
          <Slider id={oglas._id} />
        </div>
      </>
    );
  } else {
    return (
      <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Zahtev</Modal.Title>
        </Modal.Header>
        <Modal.Body>Uspešno ste poslali zahtev!</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Problem sa zahtevom</Modal.Title>
        </Modal.Header>
        <Modal.Body>Već ste poslali zahtev stanaru</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose2}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
        <section className="py-5 ">
          <div className="container px-4 px-lg-5 my-5 ">
            <div className="row gx-4 gx-lg-5 align-items-center">
              {oglas?.putanja_slike?.[0] && (
                <div className="relative" style={{ width: 700, height: 800 }}>
                  <img
                    className="object-cover aspect-square"
                    style={{ width: 700, height: 800 }}
                    src={`http://localhost:3500/uploads/${oglas?.putanja_slike[0]}`}
                    alt="..."
                  />
                  <button
                    onClick={() => setPrikaziSlike(true)}
                    className="flex gap-1 absolute py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
                    style={{ bottom: "2rem", right: "2rem" }}
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
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                    Pogledaj slike
                  </button>
                </div>
              )}
              <div className="col-md-5">
                <div className="text-xl">
                  <a
                    className=" nav-link-hover underline "
                    target="_blank"
                    href={"https://maps.google.com/?q=" + oglas.adresa}
                  >
                    {oglas.adresa}
                  </a>
                </div>

                <h1 className="display-5 fw-bolder ">{oglas.ime}</h1>
                <div className="fs-5 mb-5">
                  <span>{`${oglas.cena}€`}</span>
                  <p>{`${oglas.povrsina}m²`}</p>
                </div>
                <p className="lead">{oglas.opis}</p>
                <div className="row section-t3">
                  <div className="col-sm-12">
                    <div className="title-box-d">
                      <h3 className="title-d">Dodaci</h3>
                    </div>
                  </div>
                </div>
                <div className="amenities-list color-text-a">
                  <ul className="list-a no-margin">
                    {oglas.dodaci?.length > 0 &&
                      oglas.dodaci.map((dodatak, ind) => (
                        <li key={`${ind}`}className="ml-4"> { dodatak }&nbsp;&nbsp; </li>
                      ))}
                  </ul>
                </div>
                <div className="title-box-d">
                  <h3 className="title-d">Izdaje</h3>
                </div>
                <ProfileComponents user={stanodavac} />
                {stanar && !stanarInfo.stanuje_kod && (
                  <button
                    className="rounded-full mt-4 w-25 h-10"
                    onClick={iznajmiFun}
                  >
                    Iznajmi stan
                  </button>
                )}
              </div>
            </div>
            <div style={{ height: "550px", width: "100%" }} className="mt-5 z-10">
              {latitude && longitude ? (
                <MapContainer
                  center={[latitude, longitude]}
                  className="z-10"
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                  />
                  <Marker position={[latitude, longitude]} />
                </MapContainer>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default OglasPage;
