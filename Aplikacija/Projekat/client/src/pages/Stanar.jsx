import React from "react";

const Stanar = ({ key, ime, prezime, brtelefona }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">
        {ime} {prezime}
      </h2>
      <p className="text-lg text-gray-800">Broj telefona: {brtelefona}</p>
    </div>
  );
};

export default Stanar;
