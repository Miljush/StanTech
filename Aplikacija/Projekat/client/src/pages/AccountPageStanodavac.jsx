import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import Stanar from "./Stanar";
import OglasStanForm from "./OglasStanForm";
import ProfileComponents from "./ProfileComponents";
import OglasiComponent from "./OglasiComponent";
import OglasMajstorForm from "./OglasMajstorForm";
import OglasMajstorComponent from "./OglasMajstorComponent";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditOglasPage from "./EditOglasPage";
import EditOglasMajstor from "./EditOglasMajstor";

const AccountPageStanodavac = () => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`,
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cancelEdit = () => {
    setOglasEdit(false);
  };
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [refresh, setRefresh] = useState(false);
  const [oglasZaEdit, setOglasZaEdit] = useState("");
  const { subpage } = useParams();
  const { username, ready } = useContext(UserContext);
  const [stanari, setStanari] = useState([]);
  const [viewOglasi, setViewOglasi] = useState(false);
  const [obrisan, setObrisan] = useState(false);
  const [dodato, setDodato] = useState(false);
  const [zaBrisanje, setZaBrisanje] = useState("");
  const [zaBrisanjePopravka, setZaBrisanjePopravka] = useState("");
  const [zaSakrivanje, setZaSakrivanje] = useState("");
  const [oglasZaEditMajstor, setOglasZaEditMajstor] = useState("");
  const [editMajstorOglas, setEditMajstorOglas] = useState(false);
  const [classNameOglasi, setClassNameOglasi] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [classNameStanari, setClassNameStanari] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [classNameIzmeni, setClassNameIzmeni] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [classNamePopravke, setClassNamePopravke] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const cancelEditMajstor = ()=>{
    setEditMajstorOglas(!editMajstorOglas);
  }
  const [izmenjen,setIzmenjen] = useState(false);
  const [prikaziStanare, setPrikaziStanare] = useState(false);
  const [prikaziOglase, setPrikaziOglase] = useState(false);
  const [prikazPopravke, setPrikaziPopravke] = useState(false);
  const [prikaziFormuOglasa, setPrikaziFormuOglasa] = useState(false);
  const [oglasiList, setOglasiList] = useState([]);
  const [oglasiMajstorList, setOglasiMajstorList] = useState([]);
  const [oglasEdit, setOglasEdit] = useState(false);
  const [editovanjeMO, setEditovanjeMO] = useState(false);
  const handleDostupnost = (dostupnost) => {
    if (dostupnost == true) {
      return "bg-gray-100 rounded-lg shadow p-6 mb-4 flex";
    } else return "bg-gray-500 rounded-lg shadow p-6 mb-4 flex";
  };

  const handleButtonOglasi = async () => {
    setClassNameStanari("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameIzmeni("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    if (
      classNameOglasi == "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
    ) {
      setClassNameOglasi("");
      setClassNameOglasi("p-2 m-2 bg-gray w-md rounded-full inline-flex gap-1");
    } else {
      setClassNameOglasi("");
      setClassNameOglasi(
        "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
      );
    }
    setClassNameOglasi("m-2 bg-gray w-md rounded-full p-2 inline-flex gap-1");
    setClassNamePopravke("");
    setClassNamePopravke(
      " m-2 bg-white w-md rounded-full p-2 inline-flex gap-1"
    );
    setPrikaziFormuOglasa(!prikaziFormuOglasa);
    setPrikaziOglase(true);
    setPrikaziStanare(false);
    setPrikaziPopravke(false);
    setViewOglasi(!viewOglasi);
  };
  async function handleButtonStanari() {
    setClassNameOglasi("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameIzmeni("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameStanari("");
    setClassNameStanari(" m-2 bg-gray w-md rounded-full p-2 inline-flex gap-1");
    setClassNamePopravke("");
    setClassNamePopravke(
      "m-2 bg-white w-md rounded-full p-2 inline-flex gap-1"
    );
    try {
      const stanariList = await axios.get("/stanodavac/vratiListuStanara", {
        headers: config,
        params: { idstanodavca: username._id },
      });
      setStanari(stanariList.data);
    } catch (err) {
      console.error(err);
    }
    setPrikaziFormuOglasa(false);
    setPrikaziOglase(false);
    setPrikaziStanare(!prikaziStanare);
    setPrikaziPopravke(false);
    setViewOglasi(false);
  }
  async function handleButtonBrisanje() {
    try {
      const {data}=await axios.delete("/stanOglas/izbrisiOglas", {
        headers: config,
        params: { idOglasa: zaBrisanje },
      });
      setOglasiList((prevList) =>
        prevList.filter((oglas) => oglas._id !== zaBrisanje)
      );
      setObrisan(!obrisan);
      setShow(false);
      data?.oglas?.putanja_slike?.map(async(slika)=>{await axios.post("/deleteFileInFolder",{link:slika})});
    } catch (err) {
      console.error(err);
    }
  }
  async function handleButtonSakrivanje() {
    try {
      await axios.put(
        "/stanOglas/sakrijotrkijOglas",
        {
          id: zaSakrivanje,
        },
        { headers: config }
      );
      setShow3(false);
      setShow4(false);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleButtonBrisanjeMajstor() {
    try {
      const {data}=await axios.delete("/majstorOglas/izbrisiOglasMajstor", {
        headers: config,
        params: { idOglasa: zaBrisanjePopravka },
      });
      setOglasiMajstorList((prevList) =>
        prevList.filter((oglas) => oglas._id !== zaBrisanjePopravka)
      );
      setObrisan(!obrisan);
      setShow2(false);
      data?.oglas?.putanja_slike?.map(async(slika)=>{await axios.post("/deleteFileInFolder",{link:slika})});
    } catch (err) {
      console.error(err);
    }
  }

  const editOglas = (oglasce) => {
    if (oglasZaEdit != "") {
      setOglasZaEdit("");
    }
    setPrikaziFormuOglasa(!prikaziFormuOglasa);
    setOglasEdit(!oglasEdit);
    setOglasZaEdit(oglasce);
  };

  const editOglasMajstor = (oglasce) => {
    if (oglasZaEditMajstor != "") {
      setOglasZaEditMajstor("");
    }
    //setPrikaziPopravke(false);
    setEditMajstorOglas(!editMajstorOglas);
    setOglasZaEditMajstor(oglasce);
  };
  const handleButtonIzmeni = () => {
    setClassNameOglasi("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameStanari("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameIzmeni("");
    setClassNameIzmeni(" m-2 bg-gray w-md rounded-full p-2 inline-flex gap-1");
    setPrikaziFormuOglasa(false);
    setPrikaziOglase(false);
    setPrikaziStanare(false);
    setPrikaziPopravke(false);
    setViewOglasi(false);
  };
  const handleButtonPopravke = () => {
    setClassNameOglasi("");
    setClassNameOglasi("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setClassNameStanari("");
    setClassNameStanari("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1");
    setPrikaziFormuOglasa(false);
    setPrikaziOglase(false);
    setPrikaziStanare(false);
    setPrikaziPopravke(!prikazPopravke);
    setClassNamePopravke("");
    setClassNamePopravke(
      " m-2 bg-gray w-md rounded-full p-2 inline-flex gap-1"
    );
    setViewOglasi(false);
  };

  useEffect(() => {
    const vratiStanare=async()=>{
      try {
        if(ready){
        const stanariList = await axios.get("/stanodavac/vratiListuStanara", {
          headers: config,
          params: { idstanodavca: username._id },
        });
        setStanari(stanariList.data);
      }
      } catch (err) {
        console.error(err);
      }
    }
    
    const fetchData = async () => {
      if (ready) {
        const oglasi = await axios.get("/stanOglas/vratiOglaseZaStanodavca", {
          headers: config,
          params: { usernameStanodavca: username.username },
        });
        setOglasiList(oglasi.data);
      }
      if (ready) {
        const majstoroglasi = await axios.get(
          "/majstorOglas/vratiMajstorOglaseZaStanodavca",
          {
            headers: config,
            params: { usernameStanodavca: username.username },
          }
        );
        setOglasiMajstorList(majstoroglasi.data);
      }
    };
    fetchData();
    vratiStanare();
  }, [ready, obrisan, dodato, refresh,izmenjen]);
  if (oglasiList)
    return (
      <div className="items-center">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Brisanje Oglasa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Da li ste sigurni da želite da obrišete oglas?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary bt-background"
              variant="primary"
              onClick={handleButtonBrisanje}
            >
              Obriši
            </Button>
            <Button
              className="btn btn-primary bt-close"
              variant="secondary"
              onClick={handleClose}
            >
              Zatvori
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Brisanje Oglasa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Da li ste sigurni da želite da obrišete oglas?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary bt-background"
              variant="primary"
              onClick={handleButtonBrisanjeMajstor}
            >
              Obriši
            </Button>
            <Button
              className="btn btn-primary bt-close"
              variant="secondary"
              onClick={handleClose2}
            >
              Zatvori
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show3} onHide={handleClose3}>
          <Modal.Header closeButton>
            <Modal.Title>Sakrivanje Oglasa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Da li ste sigurni da želite da sakrijete oglas,ostali korisnici neće
            više videti vaš oglas?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary bt-background"
              variant="primary"
              onClick={handleButtonSakrivanje}
            >
              Sakrij
            </Button>
            <Button
              className="btn btn-primary bt-close"
              variant="secondary"
              onClick={handleClose3}
            >
              Zatvori
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={show4} onHide={handleClose4}>
          <Modal.Header closeButton>
            <Modal.Title>Otkrivanje Oglasa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Da li ste sigurni da želite da otrkijete oglas,ostali korisnici neće
            više videti vaš oglas?
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary bt-background"
              variant="primary"
              onClick={handleButtonSakrivanje}
            >
              Otkrij
            </Button>
            <Button
              className="btn btn-primary bt-close"
              variant="secondary"
              onClick={handleClose4}
            >
              Zatvori
            </Button>
          </Modal.Footer>
        </Modal>
        <nav className="w-full-flex">
          <button className={classNameOglasi} onClick={handleButtonOglasi}>
            Moji oglasi
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
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </button>
          <button className={classNameStanari} onClick={handleButtonStanari}>
            Moji stanari
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </button>
          {stanari.length!=0 &&
          <button className={classNamePopravke} onClick={handleButtonPopravke}>
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
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
        </button>}
          
        </nav>
        {prikaziStanare ? (
          <div>
            {stanari.map((stanar, ind) => (
              <div key={ind} className="bg-gray-100 rounded-lg shadow p-6 mb-4">
                <ProfileComponents user={stanar} />
              </div>
            ))}
          </div>
        ) : null}

        {prikaziFormuOglasa && (
          <div>
            <div>
              <OglasStanForm dodato={dodato} setDodato={setDodato} />
            </div>
          </div>
        )}
        {oglasEdit && (
          <>
            <div className="flex justify-end">
              <Link
                className="bg-white"
                to={"/account/oglasi"}
                onClick={cancelEdit}
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
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </div>
            <EditOglasPage oglas={oglasZaEdit} izmenjen={izmenjen} setIzmenjen={setIzmenjen}/>
          </>
        )}
        {viewOglasi &&
          oglasiList.length > 0 &&
          oglasiList.toReversed().map((oglas, ind) => (
            <div
              key={oglas?._id}
              className={handleDostupnost(oglas.dostupnost)}
            >
              <OglasiComponent oglas={oglas} />
              <div className="flex flex-col gap-2">
                <button
                  className="w-7 h-7 bg-transparent"
                  onClick={() => {
                    setZaBrisanje(oglas._id);
                    setShow(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
                {oglas.dostupnost == true ? (
                  <button
                    className="w-7 h-7 bg-transparent"
                    onClick={() => {
                      setZaSakrivanje(oglas._id);
                      setShow3(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.5em"
                      viewBox="0 0 576 512"
                    >
                      <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="w-7 h-7 bg-transparent"
                    onClick={() => {
                      setZaSakrivanje(oglas._id);
                      setShow4(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.5em"
                      viewBox="0 0 640 512"
                    >
                      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                    </svg>
                  </button>
                )}
                <button
                  className="w-7 h-7 bg-transparent"
                  onClick={() => {
                    editOglas(oglas);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.5em"
                    viewBox="0 0 576 512"
                    width="2.25em"
                  >
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        {prikazPopravke && (
          <div>
            <OglasMajstorForm dodato={dodato} setDodato={setDodato} />
          </div>
        )}
        {editMajstorOglas && (
          <>
            <div className="flex justify-end">
              <Link className="bg-white" to={"/account/oglasi"} onClick={cancelEditMajstor}>
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
            <EditOglasMajstor oglas={oglasZaEditMajstor} izmenjen={izmenjen} setIzmenjen={setIzmenjen}/>
          </>
        )}
        {prikazPopravke &&
          oglasiMajstorList.length > 0 &&
          oglasiMajstorList.toReversed().map((oglas, ind) => (
            <div
              key={oglas?._id}
              className="bg-gray-100 rounded-lg shadow p-6 mb-4 flex"
            >
              <OglasMajstorComponent oglas={oglas} />
              <div className="justify-center">
                <button
                  className="w-7 h-7 bg-transparent"
                  onClick={() => {
                    setShow2(true);
                    setZaBrisanjePopravka(oglas._id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
                <button
                  className="w-7 h-7 bg-transparent"
                  onClick={() => {
                    editOglasMajstor(oglas);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.5em"
                    viewBox="0 0 576 512"
                    width="2.25em"
                  >
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    );
};

export default AccountPageStanodavac;
