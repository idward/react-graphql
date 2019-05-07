//npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
// const cookie = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressGraphQL = require('express-graphql');
const {MONGO_URI} = require('./config');
require('./db/index')(MONGO_URI);
const User = require('./model/user');
const schema = require('./schema/schema');

// create the server
const app = express();

app.use(express.static(path.resolve(__dirname)))
// add & configure middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  genid: (req) => {
    console.log('Inside session middleware genid function')
    console.log(`Request object sessionID from client: ${req.sessionID}`)
    return uuid() // use UUIDs for session IDs
  },
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   httpOnly: true,
  //   maxAge: 2419200000,
  //   sameSite: true
  // }
}));

// configure passport.js to use the local strategy
// require('./services/auth')(passport);
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
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

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

// tell the server what port to listen on
app.listen('4000', () => {
  // console.log(`Server is ready at ${server.graphqlPath}`);
  console.log(`Server is ready at 4000`);
});