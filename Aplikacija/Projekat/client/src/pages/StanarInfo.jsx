import React from "react";

const StanarInfo = ({ brtelefona }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-6 mb-4">
      <p>Broj telefona stanara: {brtelefona}</p>
    </div>
  );
};

export default StanarInfo;
