const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware'); // we'll use it for logout too

const JWT_SECRET = process.env.JWT_SECRET || 'devOnlySecret';

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
