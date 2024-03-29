//jshint esversion:6
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));


app.use(express.static("public"));
app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: "USER-ADMIN PORTAL",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const DB = "mongodb://egov:DrsiaGuvTRc1KUoR@cluster0-shard-00-00.icon5.mongodb.net:27017,cluster0-shard-00-01.icon5.mongodb.net:27017,cluster0-shard-00-02.icon5.mongodb.net:27017/?ssl=true&replicaSet=atlas-gyu8ly-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB, { useNewUrlParser: true });
// mongoose.set("useCreateIndex", true);// don't use it until not get any warning after not using it

const userSchema = new mongoose.Schema({
  username: String,
  password: String,

  complain: Array,
  complainlocation: Array,
  imagelink: Array,
  complainwaterbody: Array,

  datalocation: Array,
  data: Array,
  datawaterbody: Array,

  coin: Number
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
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


app.post("/complain", function (req, res) {

  User.findById(req.body.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    }
    else {
      if (foundUser) {
        foundUser.complain.push(req.body.issue);
        foundUser.complainlocation.push(req.body.location);
        foundUser.imagelink.push(req.body.imagelink);
        foundUser.complainwaterbody.push(req.body.waterbody);

        foundUser.save(function () {
          res.sendStatus(200);
        });
      }
    }
  });
});

app.post("/dataentry", function (req, res) {
  User.findById(req.body.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    }
    else {
      if (foundUser) {
        foundUser.data.push(req.body.data);
        foundUser.datalocation.push(req.body.location);
        foundUser.datawaterbody.push(req.body.waterbody);

        foundUser.save(function () {
          res.sendStatus(200);
        });
      }
    }
  });
});


app.get("/login", function (req, res) {
  res.send(null);
});

app.post("/register", function (req, res) {
  User.register({ username: req.body.username }, req.body.password, function (err, user) {

    if (err) {
      console.log(err);
    }
    else {
      passport.authenticate("local", { failureRedirect: "/register" })(req, res, function () {
        res.send(req.user.id)
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
      passport.authenticate("local", { failureRedirect: "/login" })(req, res, function () {
        res.send(req.user.id);
      });
    }
  });
});

app.listen(4000, function () {
  console.log("app Server started on port 4000.");
});
