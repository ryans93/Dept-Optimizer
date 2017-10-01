var path = require("path");
var db = require("../models");

module.exports = function(app,passport) {

    app.get("/", function(req, res) { //login page
        res.sendFile(path.join(__dirname, "../public/index.html"));
      });

      app.get("/newUser", function(req, res) { //account sign up page
        res.sendFile(path.join(__dirname, "../public/newUser.html"));
      });

      app.get("/home", function(req, res) { //home page
        if(req.user){
        res.sendFile(path.join(__dirname, "../public/home.html"));}
        else
        res.sendFile(path.join(__dirname, "../public/index.html"));
      });

    app.post("/login",passport.authenticate('local', { failureRedirect: "/login" }),function(req,res){
        res.json(true);
    });
}
