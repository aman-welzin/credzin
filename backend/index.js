const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const passport = require("passport");
require("./config/passport");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/user");
const googleRoutes = require("./routes/googleAuthRoutes");
const card = require("./routes/cardroutes")

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Passport
app.use(passport.initialize());

// DB
database.connect();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", googleRoutes);
app.use("/api/v1/auth",card)

app.get("/", (req, res) => {
  res.send("✅ Auth Server Running");
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
