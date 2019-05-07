const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    User.findOne({email: email.toLowerCase()}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, 'Invalid Credentials');
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, 'Invalid Credientials');
        }
        return done(null, user);
      });
    });
  }));
}