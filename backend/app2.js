// const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const mysql = require("mysql2");
// const bcrypt = require("bcrypt");
// const http = require("http");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const { body, validationResult } = require("express-validator");
// const jwt=require('jsonwebtoken');

// dotenv.config();
// const app = express();
// const server = http.createServer(app);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// passport.use(
//   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//       if (err) return done(err);
//       if (results.length === 0) return done(null, false, { message: "Invalid email" });

//       const user = results[0];
//       bcrypt.compare(password, user.password, (err, isMatch) => {
//         if (err) return done(err);
//         if (!isMatch) return done(null, false, { message: "Invalid password" });
//         return done(null, user);
//       });
//     });
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
//     if (err) return done(err);
//     if(results.length===0)return done(null,false); 
//     done(null, results[0]);
//   });
// });

// app.post(
//   "/skillswap/register",
//   [
//     body("fullName").notEmpty(),
//     body("email").isEmail(),
//     body("password").isLength({ min: 6 }),
//     body("year").isInt(),
//     body("branch").notEmpty(),
//     body("college").notEmpty(),
//     body("skills").isArray(),
//     body("socialMedia").optional().isURL(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { fullName, email, password, year, branch, skills, college, socialMedia } = req.body;
//     // console.log(req.body);
//     const hashedPassword = await bcrypt.hash(password, 10);

//     db.query(
//       "INSERT INTO users (fullName, email, password, year, branch, college, skills, socialMedia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
//       [fullName, email, hashedPassword, year, branch, college, JSON.stringify(skills), socialMedia || null],
//       (err) => {
//         if (err) {
//           console.error("Database error:", err);
//           return res.status(500).json({ message: "Error registering user" });
//         }
//         res.status(201).json({ message: "User registered successfully" });
//       }
//     );
//   }
// );


// // Login user
// app.post("/skillswap/login", passport.authenticate("local"), (req, res) => {
//   console.log(req);
//   res.json({ message: "Login successful", user: req.user });
// });

// // Logout user
// app.get("/skillswap/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).json({ message: "Error logging out" });
//     res.json({ message: "Logout successful" });
//   });
// });
// // Fetch logged-in user's profile
// app.get("/skillswap/profile", (req, res) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "User not logged in" });
//   }
//   console.log(req);
//   db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Error fetching user profile" });
//     if (results.length === 0) return res.status(404).json({ message: "User not found" });
//     console.log(results[0]);
//     res.json(results[0]); // Return the user profile data
//   });
// });


// app.get("/skillswap/requests", (req, res) => {
//   const { userId } = req.query;
//   const query = `
//     SELECT cr.id, cr.sender_id AS senderId, u.fullName AS senderName 
//     FROM connection_requests cr
//     JOIN users u ON cr.sender_id = u.id
//     WHERE cr.receiver_id = ? AND cr.status = 'pending'
//   `;
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching requests:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     res.json({ requests: results });
//   });
// });
// // Edit user profile
// app.put(
//   "/skillswap/edit",
//   [
//     body("email").isEmail(),
//     body("fullName").optional().notEmpty(),
//     body("password").optional().isLength({ min: 6 }),
//     body("year").optional().isInt(),
//     body("branch").optional().notEmpty(),
//     body("skills").optional().isArray(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { fullName, email, password, year, branch, skills } = req.body;
//     let hashedPassword;

//     if (password) hashedPassword = await bcrypt.hash(password, 10);

//     const query = hashedPassword
//       ? "UPDATE users SET fullName = ?, password = ?, year = ?, branch = ?, skills = ? WHERE email = ?"
//       : "UPDATE users SET fullName = ?, year = ?, branch = ?, skills = ? WHERE email = ?";
//     const values = hashedPassword
//       ? [fullName, hashedPassword, year, branch, JSON.stringify(skills), email]
//       : [fullName, year, branch, JSON.stringify(skills), email];

//     db.query(query, values, (err, results) => {
//       if (err) return res.status(500).json({ message: "Error updating profile" });
//       if (results.affectedRows === 0) return res.status(404).json({ message: "User not found" });

//       db.query("SELECT * FROM users WHERE email = ?", [email], (err, updatedUser) => {
//         if (err) return res.status(500).json({ message: "Error fetching updated user" });
//         res.json({ message: "Profile updated successfully", user: updatedUser[0] });
//       });
//     });
//   }
// );

// // Fetch all users
// app.get("/skillswap/users", (req, res) => {
//   db.query("SELECT id, fullName AS name, year, branch, college, skills FROM users", (err, results) => {
//     if (err) return res.status(500).json({ message: "Error fetching users" });
//     res.json(results);
//   });
// });


// app.post(
//   "/skillswap/team/create",
//   [
//     // Input validation
//     body("teamName").notEmpty().withMessage("Team name is required"),
//     body("leaderId").isInt().withMessage("Leader ID must be an integer"),
//     body("members").isArray().withMessage("Members must be an array")
//       .custom((members) => {
//         if (members.length > 4) {
//           throw new Error("Members array should have a maximum of 4 members");
//         }
//         return true;
//       }),
//     body("requiredSkills").optional().isString().withMessage("Required skills should be a string"),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { teamName, leaderId, members, requiredSkills = '[]' } = req.body;

//     const teamMembers = members.length > 0 ? members : [leaderId]; // Including the leader as the first member

//     db.query(
//       "INSERT INTO teams (team_name, leader_id, members, required_skills) VALUES (?, ?, ?, ?)",
//       [teamName, leaderId, JSON.stringify(teamMembers), requiredSkills],
//       (err, results) => {
//         if (err) {
//           console.error('Error creating team:', err);
//           return res.status(500).json({ message: "Error creating team", error: err });
//         }
        
//         res.status(201).json({
//           message: "Team created successfully",
//           teamId: results.insertId,
//           teamName,
//           leaderId,
//           members: teamMembers,
//           requiredSkills,  // include requiredSkills in the response
//         });
//       }
//     );
//   }
// );

// // Fetch team details for the logged-in user (not by teamId)
// app.get("/skillswap/team", (req, res) => {
//   const userId = req.query.userId;  // Getting the logged-in userId from query params

//   db.query("SELECT * FROM teams WHERE leader_id = ? OR JSON_CONTAINS(members, ?)", [userId, JSON.stringify([userId])], (err, results) => {
//     if (err) return res.status(500).json({ message: "Error fetching team details" });
//     if (results.length === 0) return res.status(404).json({ message: "No team found for this user" });

//     const team = results[0];
//     team.members = JSON.parse(team.members);
//     res.json(team);
//   });
// });

// // Add team member
// app.put(
//   "/skillswap/team/add-member",
//   [
//     body("teamId").isInt(),
//     body("userId").isInt(),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { teamId, userId } = req.body;

//     db.query("SELECT * FROM teams WHERE id = ?", [teamId], (err, results) => {
//       if (err) return res.status(500).json({ message: "Error fetching team" });
//       if (results.length === 0) return res.status(404).json({ message: "Team not found" });

//       const team = results[0];
//       const members = JSON.parse(team.members);

//       if (members.length >= 4) return res.status(400).json({ message: "Team is already full" });
//       if (members.includes(userId)) return res.status(400).json({ message: "User is already a member" });

//       members.push(userId);

//       db.query("UPDATE teams SET members = ? WHERE id = ?", [JSON.stringify(members), teamId], (err) => {
//         if (err) return res.status(500).json({ message: "Error adding member" });
//         res.json({ message: "Member added successfully" });
//       });
//     });
//   }
// );

// // Remove team member
// app.put(
//   "/skillswap/team/remove-member",
//   [
//     body("teamId").isInt(),
//     body("userId").isInt(),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { teamId, userId } = req.body;

//     db.query("SELECT * FROM teams WHERE id = ?", [teamId], (err, results) => {
//       if (err) return res.status(500).json({ message: "Error fetching team" });
//       if (results.length === 0) return res.status(404).json({ message: "Team not found" });

//       const team = results[0];
//       const members = JSON.parse(team.members);

//       if (!members.includes(userId)) return res.status(400).json({ message: "User is not a member" });

//       const updatedMembers = members.filter((id) => id !== userId);

//       db.query("UPDATE teams SET members = ? WHERE id = ?", [JSON.stringify(updatedMembers), teamId], (err) => {
//         if (err) return res.status(500).json({ message: "Error removing member" });
//         res.json({ message: "Member removed successfully" });
//       });
//     });
//   }
// );

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const http = require("http");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return done(err);
      if (results.length === 0) return done(null, false, { message: "Invalid email" });

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: "Invalid password" });
        return done(null, user);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return done(err);
    if(results.length === 0) return done(null, false); 
    done(null, results[0]);
  });
});

app.post(
  "/skillswap/register",
  [
    body("fullName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("year").isInt(),
    body("branch").notEmpty(),
    body("college").notEmpty(),
    body("skills").isArray(),
    body("socialMedia").optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, email, password, year, branch, skills, college, socialMedia } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (fullName, email, password, year, branch, college, skills, socialMedia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [fullName, email, hashedPassword, year, branch, college, JSON.stringify(skills), socialMedia || null],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error registering user" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  }
);

// Login user
app.post("/skillswap/login", passport.authenticate("local"), (req, res) => {
  console.log(req);
  res.json({ message: "Login successful", user: req.user });
});

// Logout user
app.get("/skillswap/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "Logout successful" });
  });
});

// Fetch logged-in user's profile
app.get("/skillswap/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not logged in" });
  }
  console.log(req);
  db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching user profile" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    console.log(results[0]);
    res.json(results[0]); // Return the user profile data
  });
});
// Create a connection request
app.post("/skillswap/connect", (req, res) => {
  const { senderId, receiverId } = req.body;

  if (senderId === receiverId) {
    return res.status(400).json({ message: "You cannot connect with yourself." });
  }

  // Check if a connection request already exists between the two users
  db.query(
    "SELECT * FROM connection_requests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
    [senderId, receiverId, receiverId, senderId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ message: "Connection request already exists." });
      }

      // Insert the new connection request into the database
      db.query(
        "INSERT INTO connection_requests (sender_id, receiver_id, status) VALUES (?, ?, ?)",
        [senderId, receiverId, 'pending'],
        (err, results) => {
          if (err) return res.status(500).json({ message: "Error creating connection request" });

          res.status(201).json({ message: "Connection request sent successfully" });
        }
      );
    }
  );
});

// Endpoint to fetch connection requests for a user
app.get("/skillswap/requests", (req, res) => {
  const { userId } = req.query;

  db.query(
    `SELECT cr.id, cr.sender_id AS senderId, u.fullName AS senderName
     FROM connection_requests cr
     JOIN users u ON cr.sender_id = u.id
     WHERE cr.receiver_id = ? AND cr.status = 'pending'`,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching connection requests" });
      }
      res.json({ requests: results });
    }
  );
});
// Accept a connection request
app.put("/skillswap/requests/accept", (req, res) => {
  const { requestId } = req.body; // The connection request ID

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  // Step 1: Update the connection request status to 'accepted'
  db.query(
    "UPDATE connection_requests SET status = 'accepted' WHERE id = ?",
    [requestId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error accepting connection request" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      // Step 2: Fetch both the sender and receiver's social media links
      db.query(
        "SELECT u.id, u.fullName, u.socialMedia FROM users u JOIN connection_requests cr ON (u.id = cr.sender_id OR u.id = cr.receiver_id) WHERE cr.id = ?",
        [requestId],
        (err, users) => {
          if (err) {
            return res.status(500).json({ message: "Error fetching user social media" });
          }

          // Assuming that we have exactly 2 users (sender and receiver) in the result
          const sender = users[0];
          const receiver = users[1];

          // Ensure both users have social media links to show
          const senderSocialMedia = sender.socialMedia || "No social media linked";
          const receiverSocialMedia = receiver.socialMedia || "No social media linked";

          // Send back the response with both users' social media links
          res.json({
            message: "Connection request accepted",
            senderSocialMedia,
            receiverSocialMedia,
          });
        }
      );
    }
  );
});

// Reject a connection request
app.post("/skillswap/requests/reject", (req, res) => {
  const { requestId } = req.body; // The connection request ID

  if (!requestId) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  // Step 1: Update the connection request status to 'rejected'
  db.query(
    "UPDATE connection_requests SET status = 'rejected' WHERE id = ?",
    [requestId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error rejecting connection request" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      res.json({ message: "Connection request rejected" });
    }
  );
});

// Fetch connection requests for a user
// app.get("/skillswap/requests", (req, res) => {
//   const { userId } = req.query;
//   const query = `
//     SELECT cr.id, cr.sender_id AS senderId, u.fullName AS senderName 
//     FROM connection_requests cr
//     JOIN users u ON cr.sender_id = u.id
//     WHERE cr.receiver_id = ? AND cr.status = 'pending'
//   `;
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching requests:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     res.json({ requests: results });
//   });
// });

// Edit user profile
app.put(
  "/skillswap/edit",
  [
    body("email").isEmail(),
    body("fullName").optional().notEmpty(),
    body("password").optional().isLength({ min: 6 }),
    body("year").optional().isInt(),
    body("branch").optional().notEmpty(),
    body("skills").optional().isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, email, password, year, branch, skills } = req.body;
    let hashedPassword;

    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const query = hashedPassword
      ? "UPDATE users SET fullName = ?, password = ?, year = ?, branch = ?, skills = ? WHERE email = ?"
      : "UPDATE users SET fullName = ?, year = ?, branch = ?, skills = ? WHERE email = ?";
    const values = hashedPassword
      ? [fullName, hashedPassword, year, branch, JSON.stringify(skills), email]
      : [fullName, year, branch, JSON.stringify(skills), email];

    db.query(query, values, (err, results) => {
      if (err) return res.status(500).json({ message: "Error updating profile" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "User not found" });

      db.query("SELECT * FROM users WHERE email = ?", [email], (err, updatedUser) => {
        if (err) return res.status(500).json({ message: "Error fetching updated user" });
        res.json({ message: "Profile updated successfully", user: updatedUser[0] });
      });
    });
  }
);

// Fetch all users
app.get("/skillswap/users", (req, res) => {
  db.query("SELECT id, fullName AS name, year, branch, college, skills FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching users" });
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
