const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes")); // 👈 ADD THIS
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // We can add interview events here later
  socket.on("join_interview", (interviewId) => {
    socket.join(interviewId);
    console.log(`User joined interview: ${interviewId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});