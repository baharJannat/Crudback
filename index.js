const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const auth = require("./middleware"); // JWT middleware

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes); // public (register/login)
app.use("/users", auth, userRoutes); // protected (requires Bearer token)

// Mongo connection (ONE TIME)
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // optional: fail fast if DB is critical
  });

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health / root
app.get("/", (_req, res) => res.send("Welcome to the User CRUD API"));
app.get("/health", (_req, res) => res.json({ ok: true }));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI at     http://localhost:${PORT}/api-docs`);
});
