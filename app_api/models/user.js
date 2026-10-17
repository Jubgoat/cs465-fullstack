const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('node:util');

const pbkdf2 = promisify(crypto.pbkdf2);
const ITERATIONS = 310000;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true }
});

userSchema.methods.setPassword = async function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  const key = await pbkdf2(password, this.salt, ITERATIONS, 64, 'sha512');
  this.hash = key.toString('hex');
};

userSchema.methods.validPassword = async function(password) {
  const key = await pbkdf2(password, this.salt, ITERATIONS, 64, 'sha512');
  const storedHash = Buffer.from(this.hash, 'hex');

  return storedHash.length === key.length &&
    crypto.timingSafeEqual(storedHash, key);
};

userSchema.methods.generateJWT = function() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      name: this.name
    },
    secret,
    { expiresIn: '1h' }
  );
};

module.exports = mongoose.model('users', userSchema);