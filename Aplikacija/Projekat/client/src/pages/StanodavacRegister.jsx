import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const StanodavacRegister = () => {
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setRedirect(true);
  };
  const handleShow = () => setShow(true);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [brtelefona, setBrtelefona] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  async function registerUser(ev) {
    ev.preventDefault();
    if (profilePicture.length==0) {
      try {
        await axios.post("/registerStanodavac", {
          user,
          ime,
          prezime,
          brtelefona,
          email,
          password,
          slika: "defaultUser.jpg",
        });

        setShow(true);
      } catch (err) {
        setShow2(true);
      }
    } else {
      try {
        await axios.post("/registerStanodavac", {
          user,
          ime,
          prezime,
          brtelefona,
          email,
          password,
          slika: profilePicture[0],
        });

        setShow(true);
      } catch (err) {
        setShow2(true);
      }
    }
  }
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/dodaj", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setProfilePicture((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  if(redirect){
    return <Navigate to={"/login"}/>
  }
  else return (
    <form className="max-w-md mx-auto" onSubmit={registerUser}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Uspešno registrovanje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Registrovali ste se! Sada mozete da se ulogujete.
        </Modal.Body>
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
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Problem sa registracijom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Greška prilikom registracije. Pokušajte ponovo kasnije.
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary bt-background"
            variant="secondary"
            onClick={handleClose2}
          >
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <label htmlFor="profilePicture" className="block text-md mb-2">
          Dodajte profilnu sliku:
        </label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          onChange={uploadPhoto}
          className="block w-full border rounded-md py-2 px-3 mb-4"
        />
      </div>
      <input
        type="ime"
        placeholder="Pera"
        value={ime}
        onChange={(ev) => setIme(ev.target.value)}
        required
      />
      <input
        type="prezime"
        placeholder="Perovic"
        value={prezime}
        onChange={(ev) => setPrezime(ev.target.value)}
        required
      />
      <input
        type="brtelefona"
        placeholder="061123321"
        value={brtelefona}
        onChange={(ev) => setBrtelefona(ev.target.value)}
        required
      />
      <input
        type="username"
        placeholder="korisnicko_ime"
        value={user}
        onChange={(ev) => setUser(ev.target.value)}
        required
      />
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        required
      />
      <button className="primary">Registruj se</button>
      <div className="text-gray-500 mt-4">
        Već imate nalog?
        <Link
          to={"/login"}
          className="ml-2 text-green-500  underline nav-link-hover:hover"
        >
          Uloguj se
        </Link>
      </div>
    </form>
  );
};

export default StanodavacRegister;
