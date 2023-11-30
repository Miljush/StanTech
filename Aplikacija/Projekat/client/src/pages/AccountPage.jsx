import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import AccountPageStanodavac from "./AccountPageStanodavac";
import AccountPageMajstor from "./AccountPageMajstor";
import axios from "axios";
import ProfilePicture from "./ProfilePicture";
import AccountPageStanar from "./AccountPageStanar";
import Cookies from "js-cookie";

const AccountPage = ({ socket }) => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const [redirect, setRedirect] = useState(null);
  const { username, ready, setUsername } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [slika, setSlike] = useState([]);
  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUsername(null);
  }
  const [classNameIzmeni, setClassNameIzmeni] = useState(
    "p-2 m-2 bg-white w-md rounded-full inline-flex gap-1"
  );
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
        setSlike((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  function azurirajPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/azurirajslicku", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setSlike((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  function handleButtonIzmeni() {
    setClassNameIzmeni(" m-2 bg-gray w-md rounded-full p-2");
    setIme(username.ime);
    setPrezime(username.prezime);
    setEmail(username.email);
    setUser(username.username);
    setBrojTelefona(username.brtelefona);
    setIsEditing(true);
  }

  function cancelButton(){
    setClassNameIzmeni("");
    setClassNameIzmeni("p-2 m-2 bg-white w-md rounded-full inline-flex gap-1")
    setIsEditing(false);
  }

  function handleButtonSave() {
    if (username.role == "Stanar") {
      try {
        axios.put("/stanar/azurirajStanara", {
          id: username._id,
          username: user,
          email: email,
          brtelefona: brojTelefona,
          ime: ime,
          prezime: prezime,
          slika: slika[0],
        },{headers:config});
      } catch (err) {
        console.error(err);
      }
    }
    if (username.role == "Stanodavac") {
      try {
        axios.put("/stanodavac/azurirajStanodavca", {
          id: username._id,
          username: user,
          email: email,
          brtelefona: brojTelefona,
          ime: ime,
          prezime: prezime,
          slika: slika[0],
        },{headers:config});
      } catch (err) {
        console.error(err);
      }
    }
    if (username.role == "Majstor") {
      try {
        axios.put("/majstor/azurirajMajstora", {
          id: username._id,
          username: user,
          email: email,
          brtelefona: brojTelefona,
          ime: ime,
          prezime: prezime,
          slika: slika[0],
        },{headers:config});
      } catch (err) {
        console.error(err);
      }
    }
    setSlike([]);
    setIsEditing(false);
    window.location.reload();
  }
  useEffect(()=>{

  },[]);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !username) {
    return <Navigate to={"/login"} />;
  }
  let accountPage = null;
  if (username.role == "Stanodavac") {
    accountPage = <AccountPageStanodavac />;
  }
  if (username.role == "Majstor") {
    accountPage = <AccountPageMajstor />;
  }
  if (username.role == "Stanar") {
    accountPage = <AccountPageStanar socket={socket} />;
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div className="flex flex-col sm:flex-row md:items-center md:justify-center md:space-x-8 m-y-auto w-full pt-5">
      <div className="flex flex-col space-y-2 md:pl-8">
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row container my-10 mx-auto justify-center">
            <ProfilePicture
              imageUrl={`http://localhost:3500/uploads/${username.slika}`}
            />
            <div className="text-3xl font-medium flex flex-col">
              {username.ime} {username.prezime}
              <div className="text-lg text-gray-700">{username.username}</div>
              <div className="text-gray-500 text-lg sm:text-xl">Email: {username.email}</div>
              <div className="text-gray-500">Telefon: {username.brtelefona}</div>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <input type="file" className="" onChange={azurirajPhoto} />
            <div className="flex justify-end">
              <button className="bg-white" onClick={cancelButton}>
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
              </button>
            </div>
            <input
              type="text"
              placeholder={username.ime}
              value={ime}
              onChange={(ev) => setIme(ev.target.value)}
            />
            <input
              type="text"
              placeholder={username.prezime}
              value={prezime}
              onChange={(ev) => setPrezime(ev.target.value)}
            />
            <input
              type="username"
              placeholder={username.username}
              value={user}
              onChange={(ev) => setUser(ev.target.value)}
            />
            <input
              type="email"
              placeholder={username.email}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <input
              type="text"
              placeholder={username.brtelefona}
              value={brojTelefona}
              onChange={(ev) => setBrojTelefona(ev.target.value)}
            />
          </div>
        )}
        <button onClick={logout} className="primary ">
          Izloguj se
        </button>
        {!isEditing ? (
          <button className={classNameIzmeni} onClick={handleButtonIzmeni}>
            Izmeni podatke
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        ) : (
          <button
            className="p-2 m-2 bg-cornflowerblue w-md rounded-full gap-1"
            onClick={handleButtonSave}
          >
            Sacuvaj
          </button>
        )}

        {accountPage}
      </div>
    </div>
  );
};

export default AccountPage;
