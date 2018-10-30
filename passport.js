const fs = require("fs"); 
const path = require("path");
const http = require('http');
const https = require('https');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const express = require('express')
const passport = require('passport')
const app = express()
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
  clientID: "",
  clientSecret: "",
  callbackURL: "" 
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));



// Express and Passport Session
var session = require('express-session');
app.use(session({secret: ""}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

app.get('/', function (req, res) {
  console.log(req.subdomains);
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  

  // dump the user for debugging
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname + '/index_auth.html'));
  }
  else{
  res.sendFile(path.join(__dirname + '/index_no_auth.html'));
  }
});

app.get('/error', function (req, res) {
  var html = "you are not authorized to be here.";

  
  res.send(html);
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function (req, res) {
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
const validUsers = []
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    if(validUsers.includes(req.user.username))
    return next(); }

    console.log("redirecting invalid user");

  // denied. redirect to login
  res.redirect('/error')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("access granted. secure stuff happens here");
});

app.use('/static', ensureAuthenticated);
app.use('/static', express.static(path.join(__dirname, 'static')));



/*var server = app.listen(80, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
