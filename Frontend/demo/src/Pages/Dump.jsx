import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [teamDetails, setTeamDetails] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noJoinRequests, setNoJoinRequests] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) throw new Error("User data not found in localStorage");

        const parsedUD = JSON.parse(userData);
        const uID = parsedUD.id;
        console.log(parsedUD);
        const userResponse = await axios.get(`http://localhost:5000/skillswap/profile`, { withCredentials: true });
        setUserDetails(userResponse.data);

        fetchConnectionRequests(uID);
        fetchTeamDetails(uID);  // Pass userId instead of teamId based on the backend code
      } catch (error) {
        console.error('Error fetching user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchConnectionRequests = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/skillswap/requests?userId=${userId}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching connection requests', error);
    }
  };

  const fetchTeamDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/skillswap/team`,{params:{userId}});
      const data = response.data;
      
      // Ensure members is always an array
      const members = Array.isArray(data.members) ? data.members : JSON.parse(data.members || '[]');
      setTeamDetails({
        ...data,
        members: members, // Use parsed members
      });
      setTeamRequests(data.requests || []);
      setNoJoinRequests(data.noJoinRequests || false);
    } catch (error) {
      console.error('Error fetching team details', error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName || !requiredSkills) {
      alert('Please provide both team name and required skills.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/skillswap/team/create', {
        teamName,
        leaderId: userDetails.id,
        members: [],
      });
      setTeamDetails(response.data.team);
      alert('Team created successfully');
    } catch (error) {
      console.error('Error creating team', error);
      alert('Failed to create team');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/skillswap/team/add-member`, {
        teamId: teamDetails.id,
        userId,
      });
      alert(response.data.message);
      fetchTeamDetails(userDetails.id);  // Refresh team details
    } catch (error) {
      console.error('Error accepting request', error);
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/skillswap/team/remove-member`, {
        teamId: teamDetails.id,
        userId,
      });
      alert(response.data.message);
      fetchTeamDetails(userDetails.id);  // Refresh team details
    } catch (error) {
      console.error('Error rejecting request', error);
      alert('Failed to reject request');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (teamDetails.members.length === 1) {
      alert("Cannot remove the last member (team leader)");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/skillswap/team/remove-member`, {
        teamId: teamDetails.id,
        userId,
      });
      alert(response.data.message);
      fetchTeamDetails(userDetails.id);  // Refresh team details
    } catch (error) {
      console.error('Error removing member', error);
      alert('Failed to remove member');
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
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending requests</p>
        )}
      </section>

      <section className="team-management">
        <h2>Team Management</h2>
        {teamDetails ? (
          <div className="team-details">
            <h3>Team: {teamDetails.team_name}</h3>
            <p><strong>Members:</strong> {Array.isArray(teamDetails.members) ? teamDetails.members.join(', ') : 'Invalid members data'}</p>
            <p><strong>Leader:</strong> {teamDetails.leader_id}</p>
            {userDetails.id === teamDetails.leader_id && (
              <div className="team-requests">
                <h4>Join Requests</h4>
                {teamRequests.length > 0 ? (
                  <ul>
                    {teamRequests.map((request) => (
                      <li key={request.id}>
                        <p>{request.senderName} wants to join your team</p>
                        <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                        <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pending join requests</p>
                )}
              </div>
            )}
            <div className="remove-member">
              <h4>Remove Team Member</h4>
              {teamDetails.members.length > 1 && teamDetails.members.map((memberId) => (
                <button key={memberId} onClick={() => handleRemoveMember(memberId)}>
                  Remove Member {memberId}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="create-team">
            <h3>Create a Team</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Required Skills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
            <button onClick={handleCreateTeam}>Create Team</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/Profile1.css';
// import { Link } from 'react-router-dom';

// const Profile = () => {
//   // Hardcoded data for demonstration
//   const [userDetails, setUserDetails] = useState({
//     fullName: 'demouser10',
//     email: 'demouser10@example.com',
//     year: 1,
//     branch: 'Computer Science',
//     skills: ['python'],
//   });
//   const [requests, setRequests] = useState([
//     { id: 1, senderName: 'Aanya Singh' },
//     { id: 2, senderName: 'Dev Patel' },
//   ]);
//   const [teamDetails, setTeamDetails] = useState({
//     id: 1,
//     team_name: 'Team Alpha',
//     leader_id: 1,
//     members: ['John Doe', 'Jane Smith'],
//   });
//   const [teamName, setTeamName] = useState('');
//   const [requiredSkills, setRequiredSkills] = useState('');
//   const [teamRequests, setTeamRequests] = useState([
//     { id: 1, senderName: '' },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [noJoinRequests, setNoJoinRequests] = useState(false);

//   // Simulate the user fetching data
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 500); // Simulate network delay
//   }, []);

//   const handleCreateTeam = () => {
//     if (!teamName || !requiredSkills) {
//       alert('Please provide both team name and required skills.');
//       return;
//     }
//     // Create team logic (not implemented for hardcoded demo)
//     setTeamDetails({
//       ...teamDetails,
//       team_name: teamName,
//       members: ['Demo User'], // Initially only the creator
//     });
//     alert('Team created successfully');
//   };

//   const handleAcceptRequest = (userId) => {
//     // Logic to accept a request (hardcoded for demo)
//     setTeamDetails({
//       ...teamDetails,
//       members: [...teamDetails.members, 'David Lee'], // Hardcode accepted user
//     });
//     alert('Request accepted');
//   };

//   const handleRejectRequest = (userId) => {
//     // Logic to reject a request (hardcoded for demo)
//     alert('Request rejected');
//   };

//   const handleRemoveMember = (userId) => {
//     if (teamDetails.members.length === 1) {
//       alert("Cannot remove the last member (team leader)");
//       return;
//     }
//     setTeamDetails({
//       ...teamDetails,
//       members: teamDetails.members.filter(member => member !== 'David Lee'), // Hardcoded member removal
//     });
//     alert('Member removed');
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-container">
//       <section className="personal-details">
//         <h2>Personal Details</h2>
//         {userDetails ? (
//           <>
//             <p><strong>Name:</strong> {userDetails.fullName}</p>
//             <p><strong>Email:</strong> {userDetails.email}</p>
//             <p><strong>Year:</strong> {userDetails.year}</p>
//             <p><strong>Branch:</strong> {userDetails.branch}</p>
//             <p><strong>Skills:</strong> {userDetails.skills.join(', ')}</p>
//             <Link to='/edit'>
//               <button className="edit-btn">Edit Profile</button>
//             </Link>
//           </>
//         ) : (
//           <p>Loading user details...</p>
//         )}
//       </section>

//       <section className="connection-requests">
//         <h2>Connection Requests</h2>
//         {requests.length > 0 ? (
//           <ul>
//             {requests.map((request) => (
//               <li key={request.id}>
//                 <p>{request.senderName} wants to connect with you</p>
//                 <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No pending requests</p>
//         )}
//       </section>

//       <section className="team-management">
//         <h2>Team Management</h2>
//         {teamDetails ? (
//           <div className="team-details">
//             <h3>Team: {teamDetails.team_name}</h3>
//             <p><strong>Members:</strong> {teamDetails.members.join(', ')}</p>
//             <p><strong>Leader:</strong> {teamDetails.leader_id}</p>
//             {userDetails.fullName === 'Demo User' && (
//               <div className="team-requests">
//                 <h4>Join Requests</h4>
//                 {teamRequests.length > 0 ? (
//                   <ul>
//                     {teamRequests.map((request) => (
//                       <li key={request.id}>
//                         <p>{request.senderName} wants to join your team</p>
//                         <button onClick={() => handleAcceptRequest(request.id)}>Accept</button>
//                         <button onClick={() => handleRejectRequest(request.id)}>Reject</button>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No pending join requests</p>
//                 )}
//               </div>
//             )}
//             <div className="remove-member">
//               <h4>Remove Team Member</h4>
//               {teamDetails.members.length > 1 && teamDetails.members.map((member) => (
//                 <button key={member} onClick={() => handleRemoveMember(member)}>
//                   Remove Member {member}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="create-team">
//             <h3>Create a Team</h3>
//             <input
//               type="text"
//               placeholder="Team Name"
//               value={teamName}
//               onChange={(e) => setTeamName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Required Skills"
//               value={requiredSkills}
//               onChange={(e) => setRequiredSkills(e.target.value)}
//             />
//             <button onClick={handleCreateTeam}>Create Team</button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Profile;
