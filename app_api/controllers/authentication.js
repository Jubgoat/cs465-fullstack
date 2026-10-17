const passport = require('passport');
const User = require('../models/user');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof password !== 'string' || !password
  ) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase()
    });

    await user.setPassword(password);
    await user.save();

    return res.status(201).json({ token: user.generateJWT() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    return next(error);
  }
};

const login = (req, res, next) => {
  if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  return passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Email or password is incorrect' });
    }

    return res.status(200).json({ token: user.generateJWT() });
  })(req, res, next);
};

module.exports = { register, login };