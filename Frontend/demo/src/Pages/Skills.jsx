
// import React, { useState, useEffect } from 'react';
// import UserProfileCard from '../Components/UserProfilecard/UserProfileCard';
// import SearchBar from '../Components/SearchBar/SearchBar';
// import axios from 'axios';
// import '../styles/Skills.css';

// const Skills = () => {
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/skillswap/users');
//         console.log('Fetched users:', response.data);
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(user => 
//     user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const displayedUsers = searchQuery ? filteredUsers : users;

//   return (
//     <div className="skills-container">
//       <h1>Skills</h1>
//       <p>Explore the skills others have to offer or share your own.</p>
//       <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//       <div className="profile-card-grid">
//         {displayedUsers.map((user) => (
//           <UserProfileCard
//             key={user.id}
//             userId={user.id}
//             name={user.name}
//             year={user.year}
//             branch={user.branch}
//             skills={user.skills.join(', ')}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Skills;

import React, { useState, useEffect } from 'react';
import UserProfileCard from '../Components/UserProfilecard/UserProfileCard';
import SearchBar from '../Components/SearchBar/SearchBar';
import axios from 'axios';
import '../styles/Skills.css';

const Skills = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/skillswap/users');
        // console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (error) {
        // console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedUsers = searchQuery ? filteredUsers : users;

  return (
    <div className="skills-container">
      <h1>Skills</h1>
      <p>Explore the skills others have to offer or share your own.</p>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="profile-card-grid">
        {displayedUsers.map((user) => (
          <UserProfileCard
            key={user.id}
            userId={user.id}
            name={user.name}
            year={user.year}
            branch={user.branch}
            college={user.college} 
            skills={user.skills.join(', ')}
          />
        ))}
      </div>
    </div>
  );
};

export default Skills;
