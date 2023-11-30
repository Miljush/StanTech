import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import ProfileComponents from "./ProfileComponents";
import Loading from "./LoadingPage";
import axios from "axios";
import Cookies from "js-cookie";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const AccountPageStanar = ({ socket }) => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [classNameStanodavac, setClassNameStanodavac] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
  const [prikaziStanodavca, setPrikaziStanodavca] = useState(false);
  const { username, ready } = useContext(UserContext);
  const [stanodavac, setStanodavac] = useState("");
  const [stanar, setStanar] = useState("");
  const [prijaviProblem, setPrijaviProblem] = useState(false);
  const [description, setDescription] = useState("");
  

  useEffect(() => {
    if (ready && !stanar) {
      axios.get("/stanar/vratiStanara", {
        headers:config,
        params: { id: username._id },
      }).then((response) => {
        setStanar(response.data);
      });
    }
    if (stanar) {
      if (stanar.stanuje_kod) {
        axios
          .get("/stanodavac/vratiStanodavca", {
            headers:config,
            params: { id: stanar.stanuje_kod },
          })
          .then((response) => {
            setStanodavac(response.data);
          });
      }
    }
  }, [ready, stanar]);

  function mojiStanodavacFun() {
    setPrikaziStanodavca(!prikaziStanodavca);
    setClassNameStanodavac("");
    if (
      classNameStanodavac ==
      "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
    ) {
      setClassNameStanodavac(
        "p-2 m-2 bg-gray w-md rounded-full inline-flex gap-1"
      );
    } else {
      setClassNameStanodavac(
        "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
      );
    }
  }
  function prijaviProblemFun(ev) {
    setPrijaviProblem(!prijaviProblem);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    setDescription("");
  }

  async function obavestiFun() {
    socket.emit("prijavi-problem", {
      usernameStanodavca: stanodavac.username,
      usernameStanara: stanar.username,
      opisProblema: description,
    });
    sendNotification();
    setShow(true);
  }

  async function sendNotification() {
    try {
      const response = await fetch("http://localhost:3500/prijaviProblem", {
        method: "POST",
        body: JSON.stringify({
          usernameStanara: username.username,
          usernameStanodavca: stanodavac.username,
          opisProblema: description,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  if (!ready && !stanar) {
    return <Loading />;
  } else
    return (
      <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Zahtev za problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>Uspešno ste poslali zahtev za problem!</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
        <button className={classNameStanodavac} onClick={mojiStanodavacFun}>
          Moji stanodavac
        </button>
        {prikaziStanodavca && stanar.stanuje_kod && (
          <div>
            <ProfileComponents user={stanodavac} />
            <button
              className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full mt-2"
              onClick={prijaviProblemFun}
            >
              Prijavi problem kod stanodavca
            </button>
            {prijaviProblem && (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="description" className="mt-2">
                    Kratak opis problema:
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(ev) => {
                      setDescription(ev.target.value);
                    }}
                    maxLength={50}
                  />
                </div>
                <button
                  className="btn btn-primary bt-background"
                  onClick={obavestiFun}
                >
                  Obavesti stanodavca o problemu
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
};

export default AccountPageStanar;
