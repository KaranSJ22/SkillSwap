// const db = require('./db');

// // Add a new user
// const addUser = (userData) => {
//   const { fullName, email, password, year, branch, skills, socialMedia } = userData;
//   const skillsString = skills.join(','); // Convert skills array to string

//   return new Promise((resolve, reject) => {
//     const sql = `
//       INSERT INTO users (full_name, email, password, year, branch, skills,social_media)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//     db.query(
//       sql,
//       [fullName, email, password, year, branch, skillsString, socialMedia],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       }
//     );
//   });
// };

// // Get all users
// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM users';
//     db.query(sql, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// module.exports = { addUser, getAllUsers };
// const db = require('./db');

// // Add a new user
// const addUser = (userData) => {
//   const { fullName, email, password, year, branch, skills, socialMedia } = userData; 
//   const skillsString = skills.join(','); // Convert skills array to string

//   return new Promise((resolve, reject) => {
//     const sql = `
//       INSERT INTO users (full_name, email, password, year, branch, skills, socialMedia)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `; // Included social_media column
//     db.query(
//       sql,
//       [fullName, email, password, year, branch, skillsString, socialMedia], // Include socialMedia in query parameters
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       }
//     );
//   });
// };

// // Get all users
// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM users';
//     db.query(sql, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// module.exports = { addUser, getAllUsers };
const db = require('./db');

// Add a new user
const addUser = (userData) => {
  const { fullName, email, password, year, branch, skills, socialMedia } = userData; 
  const skillsString = skills.join(','); // Convert skills array to string

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (full_name, email, password, year, branch, skills, social_media)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `; // Corrected the column name to social_media
    db.query(
      sql,
      [fullName, email, password, year, branch, skillsString, socialMedia], // Include socialMedia in query parameters
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Get all users
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { addUser, getAllUsers };
