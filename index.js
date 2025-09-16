// index.js
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const basicAuth = require("./middleware");        // <- Basic Auth middleware
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Public routes (register / login — optional if you're only using Basic)
app.use("/auth", authRoutes);

// Protected API (Basic Auth on every request)
app.use("/users", basicAuth, userRoutes);
app.use(
  "/api-docs",
  basicAuth,                              // <- protect docs
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  })
);
app.get("/api-docs.json", basicAuth, (_req, res) => res.json(swaggerSpec));

// Mongo connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Swagger (kept public; remembers auth in the UI)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  })
);

// Health / root
app.get("/", (_req, res) => res.send("Welcome to the User CRUD API"));
app.get("/health", (_req, res) => res.json({ ok: true }));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI at     http://localhost:${PORT}/api-docs`);
});
