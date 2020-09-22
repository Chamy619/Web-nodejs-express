const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function (req, res) {
  var html = template.login("");
  res.send(html);
});

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserialize");
  db.query("SELECT * FROM user WHERE id=?", [id], function (error, user) {
    if (error) {
      next();
    }
    if (user.length === 0) {
      return done(null, false, { message: "Incorrect session" });
    } else {
      console.log(user[0]);
      done(null, user);
    }
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pwd",
    },
    function (username, password, done) {
      db.query("SELECT * FROM user WHERE id=?", [username], function (
        error,
        user
      ) {
        if (error) {
          next(error);
        } else {
          if (user.length === 0) {
            return done(null, false, { message: "Incorrect username." });
          } else if (password !== user[0].pwd) {
            return done(null, false, { message: "Incorrect password" });
          } else {
            return done(null, user[0]);
          }
        }
      });
    }
  )
);

router.post(
  "/process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/create", function (req, res) {
  var html = template.create_form();
  res.send(html);
});

router.post("/create_process", function (req, res) {
  var post = req.body;
  if (post.pwd !== post.pwd2) {
    res.redirect("/login/create");
  }

  db.query("SELECT id FROM user WHERE id=?", [post.id], function (error, user) {
    if (error) {
      next(error);
    } else if (user != "") {
      res.redirect("/login/create");
    } else {
      db.query("INSERT INTO user VALUES(?,?)", [post.id, post.pwd], function (
        error2,
        result
      ) {
        if (error2) {
          next(error2);
        } else {
          res.redirect("/login");
        }
      });
    }
  });
});

module.exports = router;
