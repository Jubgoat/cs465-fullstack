const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Bearer token required' });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

router
    .route("/trips")
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;