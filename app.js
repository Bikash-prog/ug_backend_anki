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
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// const DB = "mongodb://localhost:27017/userDATA"; //to connect with local database
// TODO:

const DB = "mongodb://egov:zGb8MWpBoFLKJgFS@cluster0-shard-00-00.icon5.mongodb.net:27017,cluster0-shard-00-01.icon5.mongodb.net:27017,cluster0-shard-00-02.icon5.mongodb.net:27017/egov?ssl=true&replicaSet=atlas-gyu8ly-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB, { useNewUrlParser: true });
// mongoose.set("useCreateIndex", true);// don't use it until not get any warning after not using it

const userSchema = new mongoose.Schema({
  // _id: String,
  username: String,
  // name: String,
  // mobile: String,
  // email: String ,
  password: String,
  


  complain: Array,
  complainlocation: Array,
  imagelink: Array,
  complainwaterbody:Array,

  datalocation: Array,
  data: Array,
  datawaterbody: Array,

  coin: Number

});



userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

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


app.get("/complain", function (req, res) {
  // if (req.isAuthenticated()) {
  //   res.render("complain");
  // } else {
  //   res.redirect("/");
  // }

  if (req.isAuthenticated()) {
    res.render("complain1");
  } else {
    res.redirect("/");
  }

});


// app.post("/complain", function (req, res) {
//   // const comp=req.body.issue;
//   console.log(req);

//   if (req.isAuthenticated()) {
//     User.findById(req.user.id, function (err, foundUser) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         if (foundUser) {
//           console.log("submitted");
//           foundUser.complain.push(comp);

//           foundUser.save(function () {
//             res.redirect("/complain");
//           });
//         }
//       }
//     });
//   } else {
//     res.redirect("/");
//   }

//   console.log("entered in this function...");

//   const comp = req.body.issue;
//   console.log(comp);
//   console.log(req);
//   console.log(req.user.id);


//   from here

//   if (req.isAuthenticated()) {
//     User.findById(req.user.id, function (err, foundUser) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         if (foundUser) {
//           console.log("submitted");
//           foundUser.complain.push(comp);

//           foundUser.save(function () {
//             res.redirect("/complain");
//           });
//         }
//       }
//     });
//   } else {
//     res.redirect("/");
//   }
//   res.send(1);


// });




app.post("/complain", function (req, res) {
  // console.log(req);

    User.findById(req.body.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          // console.log("submitted");
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
  // console.log(req);

    User.findById(req.body.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          // console.log("submitted");
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





app.get("/", function (req, res) {
  // res.render("home");
  if (req.isAuthenticated()) {
    // PASTE THIS CODE IN POST REQUEST OF COMPLAIN FORM


    // console.log(req.user);
    // console.log(req.user.id);

    User.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      }
      else {
        if (foundUser) {
          // foundUser.complain.push("this is the registered complain by user");
          // foundUser.complain.push("second complain");

          foundUser.save(function () {
            // res.redirect("/complain");
          });
        }
      }
    });

    // PASTE THIS CODE IN POST REQUEST OF COMPLAIN FORM

    // PASTE BELOW CODE TO DISPLAY ALL COMPLAIN IN COMPLAIN LIST

    User.find({ "complain": { $ne: null } }, function (err, foundUsers) {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          // console.log(foundUsers[1].complain[1]);
        }
      }
    });
    // USE ABOVE CODE TO SHOW ALL COMPLAIN IN COMPLAIN LIST


    // FOR NOW REMOVE COMMENTED PART

    res.render("secrets");
  } else {
    res.render("home");
  }
});

// app.get("/login", function (req, res) {
//   res.render("login");
// });

app.get("/login", function (req, res) {
  res.send(null);
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

  // console.log("came in this function");
  // console.log(req.body);

  User.register({ username: req.body.username }, req.body.password, function (err, user) {

    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    else {
      // type/strategy of authentication is "local"
      passport.authenticate("local", { failureRedirect: "/register" })(req, res, function () {
        // res.redirect("/secrets");
        res.send(user.id)
      });
    }
  });
});



app.post("/login", function (req, res) {

  console.log("reached here");

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", { failureRedirect: "/login" })(req, res, function () {
        // res.redirect("/secrets");
        // console.log("login successful");
        console.log(user.id);
        // return user.id;
        res.send(user.id);
      });
    }
  });

});




app.listen(4000, function () {
  console.log("app Server started on port 4000.");
});
