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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return done(err);
      if (results.length === 0) return done(null, false, { message: "Invalid email" });

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error(err);
          return done(err);
        }
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
    done(null, results[0]);
  });
});
app.post("/skillswap/register", async (req, res) => {
  const { fullName, email, password, year, branch, skills, socialMedia } = req.body; // Include socialMedia
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (fullName, email, password, year, branch, skills, socialMedia) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [fullName, email, hashedPassword, year, branch, JSON.stringify(skills), socialMedia], // Include socialMedia in query parameters
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});
app.post("/skillswap/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});
app.get("/skillswap/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "Logout successful" });
  });
});
app.put("/skillswap/edit", async (req, res) => {
  const { fullName, email, password, year, branch, skills } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  let hashedPassword;
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json({ message: "Error hashing password" });
    }
  }
  const skillsString = JSON.stringify(skills);
  const query = hashedPassword
    ? `UPDATE users SET fullName = ?, password = ?, year = ?, branch = ?, skills = ? WHERE email = ?`
    : `UPDATE users SET fullName = ?, year = ?, branch = ?, skills = ? WHERE email = ?`;
  const values = hashedPassword
    ? [fullName, hashedPassword, year, branch, skillsString, email]
    : [fullName, year, branch, skillsString, email];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, updatedUser) => {
      if (err) {
        console.error("Error fetching updated user details:", err);
        return res.status(500).json({ message: "Error fetching updated user details" });
      }
      if (updatedUser.length === 0) {
        return res.status(404).json({ message: "Updated user details not found" });
      }
      res.json({ message: "Profile updated successfully", user: updatedUser[0] });
    });
  });
});
app.get("/skillswap/users", (req, res) => {
  const query = "SELECT id, fullName AS name, year, branch, skills FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});
app.get("/skillswap/skills", (req, res) => {
  const { query } = req.query;
  const sql = query ? "SELECT * FROM users WHERE skills LIKE ?" : "SELECT * FROM users";
  const params = query ? [`%${query}%`] : [];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching skills" });
    }
    res.json(results);
  });
});
app.post("/skillswap/connect", (req, res) => {
    const { senderId, receiverId } = req.body;
  
    // Check if a request already exists between these users
    const checkQuery = `
      SELECT * FROM connection_requests
      WHERE sender_id = ? AND receiver_id = ?
    `;
    db.query(checkQuery, [senderId, receiverId], (err, results) => {
      if (err) {
        console.error("Error checking for existing request:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "Connection request already sent" });
      }
  
      // Create a new connection request
      const query = `
        INSERT INTO connection_requests (sender_id, receiver_id, status)
        VALUES (?, ?, 'pending')
      `;
      db.query(query, [senderId, receiverId], (err) => {
        if (err) {
          console.error("Error sending connection request:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.json({ message: "Connection request sent successfully" });
      });
    });
  });
  app.get("/skillswap/requests", (req, res) => {
    const { userId } = req.query;
    const query = `
      SELECT cr.id, cr.sender_id AS senderId, u.fullName AS senderName 
      FROM connection_requests cr
      JOIN users u ON cr.sender_id = u.id
      WHERE cr.receiver_id = ? AND cr.status = 'pending'
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching requests:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ requests: results });
    });
  });
  app.put("/skillswap/connect/accept", (req, res) => {
    const { requestId } = req.body;
  
    const acceptQuery = `
      UPDATE connection_requests 
      SET status = 'accepted' 
      WHERE id = ?
    `;
  
    db.query(acceptQuery, [requestId], (err) => {
      if (err) {
        console.error("Error accepting request:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      // Fetch the sender's social media link
      const fetchLinkQuery = `
        SELECT u.socialMedia
        FROM connection_requests cr
        JOIN users u ON cr.sender_id = u.id
        WHERE cr.id = ?
      `;
  
      db.query(fetchLinkQuery, [requestId], (err, results) => {
        if (err) {
          console.error("Error fetching social media link:", err);
          return res.status(500).json({ message: "Error retrieving social media link" });
        }
  
        if (results.length > 0) {
          res.json({
            message: "Request accepted successfully",
            socialMediaLink: results[0].socialMedia
          });
        } else {
          res.json({ message: "Request accepted but no social media link found" });
        }
      });
    });
  });
  app.post("/skillswap/team/create", (req, res) => {
    const { teamName, leaderId, members } = req.body;
  
    if (!teamName || !leaderId || !members || members.length < 2 || members.length > 4) {
      return res.status(400).json({ message: "Invalid team data" });
    }
  
    const membersJSON = JSON.stringify(members);
  
    db.query(
      "INSERT INTO teams (team_name, leader_id, members) VALUES (?, ?, ?)",
      [teamName, leaderId, membersJSON],
      (err, results) => {
        if (err) {
          console.error("Error creating team:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({ message: "Team created successfully", teamId: results.insertId });
      }
    );
  });
  app.get("/skillswap/team/:teamId", (req, res) => {
    const { teamId } = req.params;
  
    db.query("SELECT * FROM teams WHERE id = ?", [teamId], (err, results) => {
      if (err) {
        console.error("Error fetching team details:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      const team = results[0];
      team.members = JSON.parse(team.members); // Parse JSON
      res.json(team);
    });
  });
  app.put("/skillswap/team/add-member", (req, res) => {
    const { teamId, userId } = req.body;
  
    db.query("SELECT * FROM teams WHERE id = ?", [teamId], (err, results) => {
      if (err) {
        console.error("Error fetching team:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      const team = results[0];
      const members = JSON.parse(team.members);
  
      if (members.length >= 4) {
        return res.status(400).json({ message: "Team is already full" });
      }
  
      if (members.includes(userId)) {
        return res.status(400).json({ message: "User is already a member" });
      }
  
      members.push(userId);
  
      db.query("UPDATE teams SET members = ? WHERE id = ?", [JSON.stringify(members), teamId], (err) => {
        if (err) {
          console.error("Error adding member:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.json({ message: "Member added successfully" });
      });
    });
  });
  app.put("/skillswap/team/remove-member", (req, res) => {
    const { teamId, userId } = req.body;
  
    db.query("SELECT * FROM teams WHERE id = ?", [teamId], (err, results) => {
      if (err) {
        console.error("Error fetching team:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      const team = results[0];
      const members = JSON.parse(team.members);
  
      if (!members.includes(userId)) {
        return res.status(400).json({ message: "User is not a member of this team" });
      }
  
      const updatedMembers = members.filter((id) => id !== userId);
  
      db.query("UPDATE teams SET members = ? WHERE id = ?", [JSON.stringify(updatedMembers), teamId], (err) => {
        if (err) {
          console.error("Error removing member:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.json({ message: "Member removed successfully" });
      });
    });
  });
// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



