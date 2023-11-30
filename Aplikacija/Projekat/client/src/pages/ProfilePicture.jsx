import React from "react";

const ProfilePicture = ({ imageUrl }) => {
  return (
    <div className="flex-shrink-0 w-40 mr-6">
      <div className="h-40 w-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Profile"
          className="h-full w-full object-cover rounded-full border-4 border-green-500"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
