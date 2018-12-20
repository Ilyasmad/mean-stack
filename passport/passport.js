var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
var keys = require('../config/keys');

module.exports = function(app, passport) {

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

  passport.serializeUser(function(user, done) {
      token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
      done(null, user.id);
    });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  passport.use(new GoogleStrategy({
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user) {
          if (err) done(err);

          if (user && user !== null) {
              done(null, user);
          } else {
              done(err);
          }
      });
    }
  ));

  app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
      res.redirect('/google/' + token);
    });

  return passport;
}
