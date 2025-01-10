
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const socketIo = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const cors=require('cors');

dotenv.config();

// Initializing Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
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
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));
// MySQL Database Connection
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

// Passport Configuration
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
        if (!isMatch){
          console.log("Invalid pswd");
         return done(null, false, { message: "Invalid password" });
        }
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

// Routes
app.post("/skillswap/register", async (req, res) => {
  const { fullName, email, password, year, branch, skills } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (fullName, email, password, year, branch, skills) VALUES (?, ?, ?, ?, ?, ?)",
    [fullName, email, hashedPassword, year, branch, JSON.stringify(skills)],
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
  console.log("User authenticated:",req.user);
  res.json({ message: "Login successful", user: req.user });
});

app.get("/skillswap/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "Logout successful" });
  });
});

// app.put('/skillswap/edit', async (req, res) => {
//   const { fullName, email, password, year, branch, skills } = req.body;
//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   let hashedPassword;
//   if (password) {
//     try {
//       hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
//     } catch (error) {
//       console.error('Error hashing password:', error);
//       return res.status(500).json({ message: 'Error hashing password' });
//     }
//   }

//   const skillsString = JSON.stringify(skills);

//   const query = hashedPassword
//     ? `UPDATE users SET fullName = ?, password = ?, year = ?, branch = ?, skills = ? WHERE email = ?`
//     : `UPDATE users SET fullName = ?, year = ?, branch = ?, skills = ? WHERE email = ?`;

//   const values = hashedPassword
//     ? [fullName, hashedPassword, year, branch, skillsString, email]
//     : [fullName, year, branch, skillsString, email];

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.error('Error updating profile:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'Profile updated successfully' });
//   });
// });
app.put('/skillswap/edit', async (req, res) => {
  const { fullName, email, password, year, branch, skills } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  let hashedPassword;
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ message: 'Error hashing password' });
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
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the updated user details
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, updatedUser) => {
      if (err) {
        console.error('Error fetching updated user details:', err);
        return res.status(500).json({ message: 'Error fetching updated user details' });
      }

      if (updatedUser.length === 0) {
        return res.status(404).json({ message: 'Updated user details not found' });
      }

      res.json({ message: 'Profile updated successfully', user: updatedUser[0] });
    });
  });
});

app.get('/skillswap/users', (req, res) => {
  const query = 'SELECT id, fullName AS name, year, branch, skills FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});


app.get("/skillswap/skills", (req, res) => {
  const { query } = req.query;
  const sql = query
    ? `SELECT * FROM users WHERE skills LIKE ?`
    : `SELECT * FROM users`;
  const params = query ? [`%${query}%`] : [];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching skills" });
    }
    res.json(results);
  });
});
// Route to send a connection request
app.post('/skillswap/connect', (req, res) => {
  const { senderId, receiverId } = req.body;

  const query = 'INSERT INTO connection_requests (sender_id, receiver_id) VALUES (?, ?)';
  db.query(query, [senderId, receiverId], (err, results) => {
    if (err) {
      console.error('Error sending connection request:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Connection request sent successfully' });
  });
});

// Route to accept a connection request
app.put('/skillswap/connect/accept', (req, res) => {
  const { requestId } = req.body;

  const query = "UPDATE connection_requests SET status = 'accepted' WHERE id = ?";
  db.query(query, [requestId], (err, results) => {
    if (err) {
      console.error('Error accepting connection request:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'Connection request accepted successfully' });
  });
});

// Route to fetch connection requests for a user
app.get('/skillswap/connections/:userId', (req, res) => {
  const { userId } = req.params;

  const query = "SELECT * FROM connection_requests WHERE receiver_id = ? AND status = 'pending'";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching connection requests:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

// Socket.io for Chatting
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ userId1, userId2 }) => {
    const room = [userId1, userId2].sort().join(":");
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on("sendMessage", (message) => {
    const room = [message.sender, message.recipient].sort().join(":");
    io.to(room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// MySQL Schema
const createTables = () => {
  const usersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    year VARCHAR(255),
    branch VARCHAR(255),
    skills JSON
  )`;

  db.query(usersTable, (err) => {
    if (err) console.error("Error creating users table:", err);
  });
};
createTables();

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
