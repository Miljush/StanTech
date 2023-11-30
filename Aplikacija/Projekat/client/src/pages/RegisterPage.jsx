import React, { useState } from "react";
import { Link } from "react-router-dom";
import StanarRegister from "./StanarRegister";
import StanodavacRegister from "./StanodavacRegister";
import MajstorRegister from "./MajstorRegister";

const RegisterPage = () => {
  const [userType, setUserType] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  let registerForm = null;

  if (userType === "majstor") {
    registerForm = <MajstorRegister />;
  } else if (userType === "stanodavac") {
    registerForm = <StanodavacRegister />;
  } else if (userType === "stanar") {
    registerForm = <StanarRegister />;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl text-center mb-4">Registruj se</h1>
      <div>
        <label htmlFor="userType" className="block text-md mb-2">
          Izaberite tip korisnika:
        </label>
        <select
          id="userType"
          name="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className="block w-full border rounded-md py-2 px-3 mb-4"
        >
          <option value="">Izaberite tip korisnika</option>
          <option value="majstor">Majstor</option>
          <option value="stanodavac">Stanodavac</option>
          <option value="stanar">Stanar</option>
        </select>
      </div>
      {registerForm}
    </div>
  );
};

export default RegisterPage;
