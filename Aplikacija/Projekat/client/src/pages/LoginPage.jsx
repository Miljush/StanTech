import React, { useContext, useState } from "react";
import Header from "../Header";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const LoginPage = () => {
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUsername} = useContext(UserContext);
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/login", { user, pwd });
      setUsername(response.data);
      setShow(true);
      setRedirect(true);
    } catch (err) {
      setShow2(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    
    <div className="mt-4 grow flex items-center justify-around">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Uspešno logovanje</Modal.Title>
        </Modal.Header>
        <Modal.Body>Uspešno ste se ulogovali i sada možete koristiti sve funkcionalnosti sajta</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Problem sa logovanjem</Modal.Title>
        </Modal.Header>
        <Modal.Body>Proverite da li su uneti username i šifra ispravni</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-primary bt-background" variant="secondary" onClick={handleClose2}>
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="-mt-48">
        <h1 className="text-4xl text-center mb-4">Uloguj se</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="username"
            placeholder="username"
            value={user}
            onChange={(ev) => setUser(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={pwd}
            onChange={(ev) => setPwd(ev.target.value)}
          />
          <button className="primary">Uloguj se</button>
          <div className="text-center py-2 text-gray-500">
            Nemate nalog?
            <Link
              className="ml-2 text-green-500  underline nav-link-hover:hover"
              to={"/register"}
            >
              {" "}
              Registruj se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
