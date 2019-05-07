const passport = require('passport');
const User = require('../model/user');

const signup = async ({email, password, req}) => {
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  const user = await User.findOne({email});
  if (user) {
    throw new Error('Email in user.');
  }
  const newUser = await (new User({email, password})).save();
  return new Promise((resolve, reject) => {
    req.logIn(newUser, (err) => {
      if (err) reject(err);
      resolve(newUser);
    });
  });
}

const login = ({email, password, req}) => {
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (err) return reject(err);
      if (!user) return reject('Invalid credientials');
      req.logIn(user, (err) => {
        if (err) return reject(err);
        return resolve(user);
      });
    })({body: {email, password}});
  });
}



module.exports = {login, signup};