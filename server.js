var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


var app = express();
var PORT = process.env.PORT || 8080; //port initialized

var db = require("./models");


passport.use(new Strategy( //passport authentication
  function(username, password, cb) {
    db.User.findOne({where:{user_id:username}}).then(function(user) {
      if (!user) { return cb(null, false); }
      if (user.user_password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

  passport.serializeUser(function(user, cb) {
    console.log(user);
    cb(null, user.user_id);
  });
  
  passport.deserializeUser(function(id, cb) {
    db.User.findOne({where:{user_id:id}}).then(function ( user) {
      cb(null, user);
    });
  });



app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
//app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


app.use(express.static("./public"));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//Routes
require("./routes/html-routes.js")(app,passport);
require("./routes/api-routes.js")(app);

db.sequelize.sync().then(function() { //server started
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });
