import React, { useEffect, useState } from "react";
import axios from "axios";

const Conversation = ({ data, currentUserId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);

    const getUserData = async () => {
      try {
        const response = await axios.post("/getUser", { id: userId });
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [data.members, currentUserId]);

  const handleButtonClick = () => {
    console.log("Button pressed:", userData);
  };

  return (
    <div className="flex justify-center">
      <button className="bg-green-200 px-2 rounded-2xl  justify-center flex border-2 border-black w-[90px] h-[50px]">
        <div>
          {<div className="" onClick={handleButtonClick}></div>}
          <div className="name flex-col" style={{ fontSize: "0.8rem" }}>
            <div>
            <div>{userData?.ime}</div> 
            <div>{userData?.prezime}</div>
            </div>
          </div>
        </div>
      </button>
     
    </div>
  );
};

export default Conversation;
