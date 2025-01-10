import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile1.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    senderSocialMedia: '',
    receiverSocialMedia: '',
  });

  // Fetch user data and connection requests when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) throw new Error("User data not found in localStorage");

        const parsedUD = JSON.parse(userData);
        const uID = parsedUD.id;

        // Fetch user profile
        const userResponse = await axios.get(`http://localhost:5000/skillswap/profile`, { withCredentials: true });
        setUserDetails(userResponse.data);

        // Fetch connection requests
        fetchConnectionRequests(uID);
      } catch (error) {
        console.error('Error fetching user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch pending connection requests for the user
  const fetchConnectionRequests = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/skillswap/requests?userId=${userId}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching connection requests', error);
    }
  };

  // Accept a connection request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.put(`http://localhost:5000/skillswap/requests/accept`, {
        requestId, // Pass the requestId, not userId
      });

      alert(response.data.message);
      setSocialMediaLinks({
        senderSocialMedia: response.data.senderSocialMedia,
        receiverSocialMedia: response.data.receiverSocialMedia,
      });

      fetchConnectionRequests(userDetails.id); // Refresh the connection requests
    } catch (error) {
      console.error('Error accepting request', error);
      alert('Failed to accept request');
    }
  };

  // Reject a connection request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.put(`http://localhost:5000/skillswap/requests/reject`, {
        requestId, // Pass the requestId, not userId
      });
      alert(response.data.message);
      fetchConnectionRequests(userDetails.id); // Refresh the connection requests
    } catch (error) {
      console.error('Error rejecting request', error);
      alert('Failed to reject request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <section className="personal-details">
        <h2>Personal Details</h2>
        {userDetails ? (
          <>
            <p><strong>Name:</strong> {userDetails.fullName}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Year:</strong> {userDetails.year}</p>
            <p><strong>Branch:</strong> {userDetails.branch}</p>
            <p><strong>Skills:</strong> {userDetails.skills.join(', ')}</p>
            <Link to='/edit'>
              <button className="edit-btn">Edit Profile</button>
            </Link>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </section>

      <section className="connection-requests">
        <h2>Connection Requests</h2>
        {requests.length > 0 ? (
          <ul>
            {requests.map((request) => (
              <li key={request.id}>
                <p>{request.senderName} wants to connect with you</p>
                <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending requests</p>
        )}
      </section>

      {/* Display Social Media Links */}
      {socialMediaLinks.senderSocialMedia && (
        <section className="social-media">
          <h3>Social Media Links</h3>
          <p><strong>Sender's Social Media:</strong> {socialMediaLinks.senderSocialMedia}</p>
          {/* <p><strong>Receiver's Social Media:</strong> {socialMediaLinks.receiverSocialMedia}</p> */}
        </section>
      )}
    </div>
  );
};

export default Profile;
