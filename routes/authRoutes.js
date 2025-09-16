const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware'); // we'll use it for logout too

const JWT_SECRET = process.env.JWT_SECRET || 'devOnlySecret';

router.post('/register', async (req, res) => {
  try {
    const { name, age, email, password } = req.body || {};
    if (!name || typeof age !== 'number' || !email || !password) {
      return res.status(400).json({ message: 'name, age, email, password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, age, email, password });
    await user.save(); // password gets hashed by the model's pre('save')

    // optional: also return a JWT if you ever want to use it
    // const token = jwt.sign({ id: user._id.toString(), v: user.tokenVersion }, JWT_SECRET, { expiresIn: '1h' });
    // return res.status(201).json({ token });

    return res.status(201).json({ message: 'Registered', id: user._id });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ message: 'Register failed' });
  }
});

// POST /auth/login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password' });

    // include tokenVersion in payload:
    const token = jwt.sign({ id: user._id.toString(), v: user.tokenVersion }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /auth/logout  -> increments version to revoke existing tokens
router.post('/logout', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
    res.json({ message: 'Logged out (tokens revoked)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
