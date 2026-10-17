const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });

      if (!user || !(await user.validPassword(password))) {
        return done(null, false, { message: 'Email or password is incorrect' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));