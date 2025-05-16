const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

// Patient routes
const patientRoutes = require("./routes/api/patient");

// Middleware
app.use(express.json());

// Set up CORS with specific origin
const allowedOrigins = [
  "http:localhost:3000",
  "http:localhost:5173",
  "https://prms-s784.onrender.com",
  "https://docsys.onrender.com",
  "https://hmo-queue.netlify.app",
  "https://docsys-app-server.onrender.com",
  "https://simc-billing-system.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.options('*', cors());

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/patients", patientRoutes);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.get('/api/user', authenticateToken, (req, res) => {
  res.json({ username: req.user.username });
});

// Simple API route for testing
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB is connected!"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
