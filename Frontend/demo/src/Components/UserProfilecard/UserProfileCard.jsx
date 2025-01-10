import React from "react";
import "./UserProfileCard.css";
import axios from "axios";

const UserProfileCard = ({ userId, name, year, branch,college, skills }) => {
  const handleConnect = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log({
          senderId: user.id,
          receiverId: userId,

        });
        
        const response = await axios.post("http://localhost:5000/skillswap/connect", {
          senderId: user.id,
          receiverId: userId,
        });
        alert(response.data.message);
      } else {
        alert("Please log in to send a connection request.");
      }
    } catch (error) {
      console.error("Error connecting:", error);
      alert("Failed to send connection request.");
    }
  };

  // Ensure skills is an array before calling join()
  const formattedSkills = Array.isArray(skills) ? skills.join(", ") : skills || "No skills available";

  return (
    <div className="card">
      <div className="background-image"></div>
      <div className="text-container">
        <h3 className="name">Name: {name}</h3>
        <p className="year">Year: {year}</p>
        <p className="branch">Branch: {branch}</p>
        <p className="clg">College: {college}</p>
        <p className="skills">
          <strong>Skills:</strong> {formattedSkills}
        </p>
      </div>

      {/* Connect Button */}
      <button className="connect-button" onClick={handleConnect}>
        Connect
      </button>
    </div>
  );
};

export default UserProfileCard;
