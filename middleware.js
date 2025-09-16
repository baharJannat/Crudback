
// middleware.js
const User = require('./models/user'); // adjust path if different

// Sends 401 and browser/Swagger will prompt for creds if route is protected
function deny(res, msg = 'Authentication required') {
  res.set('WWW-Authenticate', 'Basic realm="User API", charset="UTF-8"');
  return res.status(401).json({ message: msg });
}

const basicAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Basic ')) return deny(res);

    // Decode "Basic base64(email:password)"
    const raw = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const sep = raw.indexOf(':');
    if (sep < 0) return deny(res);

    const email = raw.slice(0, sep).trim();
    const password = raw.slice(sep + 1);

    if (!email || !password) return deny(res);

    // If your schema has password { select: false }, keep the .select('+password')
    const user = await User.findOne({ email }).select('+password');
    if (!user) return deny(res, 'Invalid email or password');

    const ok = await user.comparePassword(password);
    if (!ok) return deny(res, 'Invalid email or password');

    req.user = { id: user._id, email: user.email };
    next();
  } catch (err) {
    return deny(res, 'Invalid authorization header');
  }
};

module.exports = basicAuth;

