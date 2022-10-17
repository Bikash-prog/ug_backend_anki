//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const DB = "mongodb://localhost:27017/userDATA"; //to connect with local database 

// const DB="mongodb://egov:zGb8MWpBoFLKJgFS@cluster0-shard-00-00.icon5.mongodb.net:27017,cluster0-shard-00-01.icon5.mongodb.net:27017,cluster0-shard-00-02.icon5.mongodb.net:27017/egov?ssl=true&replicaSet=atlas-gyu8ly-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB, { useNewUrlParser: true });
// mongoose.set("useCreateIndex", true);// don't use it until not get any warning after not using it

const userSchema = new mongoose.Schema({
  // _id: String,
  aadhaar: String,
  // name: String,
  // mobile: String,
  // email: String ,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get("/users", function (req, res) {
  User.find(function (err, foundUser) {
    if (!err) {
      res.send(foundUser);
    }
    else {
      res.send(err);
    }
  });
});


app.get("/", function (req, res) {
  // res.render("home");
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.render("home");
  }
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


app.post("/register", function (req, res) {

  User.register({ username: req.body.username }, req.body.password, function (err, user) {

    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    else {
      // type/strategy of authentication is "local"
      passport.authenticate("local",{failureRedirect: "/register"})(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });

});



app.post("/login", function (req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local",{failureRedirect: "/login"})(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });

});




app.listen(4000, function () {
  console.log("temp Server started on port 4000.");
});
