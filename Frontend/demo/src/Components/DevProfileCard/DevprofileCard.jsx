import React from "react";
import "../UserProfilecard/UserProfileCard.css";

const DevProfileCard = ({ name, year,email, profileImage }) => {
  return (
    <div className="card">
      <div className="background-image"></div>
      <div className="image-container">
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="text-container">
        <h3 className="name">{name}</h3>
        <p className="year">{year}</p>
        <p className="email">{email}</p>
      </div>
    </div>
  );
};

export default DevProfileCard;
