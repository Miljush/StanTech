import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import { UserContext } from "../UserContext";
import AccountPage from "./AccountPage";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import Cookies from "js-cookie";


const ProfilePage = () => {
  const config = {
    Authorization: `Bearer ${Cookies.get("token")}`
  }
  const [user, setUser] = useState(null);
  const [ocene, setOcene] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOcene, setViewOcene] = useState(false);
  const [dodajOcenu, setDodajOcenu] = useState(false);
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const { username: userData, ready } = useContext(UserContext);
  const { username } = useParams();
  const [dugme, setDugme] = useState(false);
  const [istiUser, setIstiUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await axios.get(`/profile/${username}`);
        setUser(userInfo.data);

        const oceneInfo = await axios.post("/ocena/vratiOceneZaUsera", {
          username: `${username}`,
        });
        setOcene(oceneInfo.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  function viewOceneFun() {
    setViewOcene(!viewOcene);
  }

  function dodajOcenuFun() {
    setDodajOcenu(!dodajOcenu);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userData) {
      alert("Niste ulogovani!");
      return;
    }
    try {
      await axios.post("/ocena/dodajOcenu", {
        description: description,
        stars: stars,
        postedby: userData._id,
        postedfor: user._id,
      },{headers:config});
    } catch (err) {
      console.error(err);
    }
    setDodajOcenu(false);
    setStars(0);
    setDescription("");
    window.location.reload();
  };

  if (!user) {
    return <LoadingPage/>;
  }
  if(ready)
  {
  if (username == userData?.username) {
    return <AccountPage />;
  } else
    return (
      <div className="bg-white min-h-screen mt-5">
        <div className="bg-gray-100 container mx-auto my-5 py-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {user.ime} {user.prezime}
              </h1>
              <h1 className="text-md">{user.username}</h1>
              <p className="text-gray-500">{user.role}</p>
            </div>
            <div className="flex justify-center mt-8">
              <ProfilePicture
                imageUrl={`http://localhost:3500/uploads/${user.slika}`}
              />
            </div>
            {user.role == "Stanodavac" ? (
              <div>
                <h3>Oglasi stanodavca</h3>
                <ul className="list-disc list-inside">
                  {user.lista_oglasa.length > 0 &&
                    user.lista_oglasa.map((link) => (
                      <li className="text-blue-500 hover:underline" key={link}>
                        <a
                          href={`http://localhost:5173/oglas/${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Oglas
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <></>
            )}
            {user.role == "Majstor" ? (
              <div>
                <h3>Usluge majstora</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {user.usluge.length > 0 &&
                    user.usluge.map((link) => <li key={link}>{link}</li>)}
                </ul>
              </div>
            ) : (
              <></>
            )}
            <button
              className="btn btn-primary mb-2 mr-2 bt-background"
              type="button"
              onClick={viewOceneFun}
            >
              Ocene
            </button>   
            {userData &&(
            <button
              className="btn btn-primary mb-2 bt-background"
              type="button"
              onClick={dodajOcenuFun}
            >
              {" "}
              Dodaj ocenu
            </button>
            )}
            {dodajOcenu && (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="stars">Vrednost ocene (1-5):</label>
                  <input
                    type="number"
                    id="stars"
                    min={1}
                    max={5}
                    value={stars}
                    onChange={(ev) => {
                      setStars(ev.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="description">Opis:</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(ev) => {
                      setDescription(ev.target.value);
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary bt-background">
                  Posalji ocenu
                </button>
              </form>
            )}

            {viewOcene &&
              ocene.length > 0 &&
              ocene.map((ocena) => (
                <div key={ocena._id}>
                  <div className="card card-body">
                    <h3>Ocena: {ocena.stars}</h3>
                    <p>{ocena.description}</p>
                    <a
                      href={`http://localhost:5173/profile/${ocena.postedby}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-hover:underline"
                    >
                      {ocena.postedby}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
              }
              else
              return <LoadingPage/>
};

export default ProfilePage;
