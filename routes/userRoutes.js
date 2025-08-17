const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User CRUD endpoints
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 66b7d3a5f0c1d21f6a4d3a9e
 *         name:
 *           type: string
 *           example: John Smith
 *         age:
 *           type: integer
 *           example: 30
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserCreate:
 *       type: object
 *       required: [name, age, email]
 *       properties:
 *         name:
 *           type: string
 *           example: John Smith
 *         age:
 *           type: integer
 *           example: 30
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *
 *     UserPut:
 *       type: object
 *       required: [name, age, email]
 *       properties:
 *         name:
 *           type: string
 *           example: John Smith Updated
 *         age:
 *           type: integer
 *           example: 31
 *         email:
 *           type: string
 *           format: email
 *           example: john.updated@example.com
 *
 *     UserPatch:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Optional new name
 *         age:
 *           type: integer
 *           example: 33
 *         email:
 *           type: string
 *           format: email
 *           example: new.email@example.com
 *
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         deletedCount:
 *           type: integer
 *           example: 1
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User not found
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Found user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Replace a user (all required fields)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPut'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user (partial)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPatch'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       404:
 *         description: Not found
 */

// Helper: validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *       example:
 *         name: John Doe
 *         email: john@example.com
 *         age: 30
 */

// GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id - Get single user
router.get("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users - Create user
router.post("/", async (req, res) => {
  const { name, email, age } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof age !== "number" ||
    isNaN(age)
  ) {
    return res
      .status(400)
      .json({ message: "name, email, and age are required" });
  }
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json({ message: "saved successfully", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/:id - Replace user
router.put("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  const { name, email, age } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof age !== "number" ||
    isNaN(age)
  ) {
    return res
      .status(400)
      .json({ message: "name, email, and age are required" });
  }
  try {
    const doc = await User.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "User not found" });

    doc.overwrite(req.body);
    const saved = await doc.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /users/:id - Update user fields
router.patch("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id - Delete user
router.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
