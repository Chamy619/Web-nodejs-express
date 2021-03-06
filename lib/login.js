const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
var bcryptjs = require("bcryptjs");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(flash());

var passport = require("./passport")(router);

router.get("/", function (req, res) {
  var fmsg = req.flash();
  var text = "";
  if (fmsg.error) {
    text = fmsg.error;
  }
  var html = template.login(text);
  res.send(html);
});

router.post(
  "/process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/create", function (req, res) {
  var fmsg = req.flash();
  var text = "";
  if (fmsg.error) {
    text = fmsg.error;
  }
  var html = template.create_form(text);
  res.send(html);
});

router.post("/create_process", function (req, res) {
  var post = req.body;
  console.log("p1", post.pwd);
  console.log("p2", post.pwd2);
  if (post.pwd === "" || post.pwd2 === "") {
    req.flash("error", "Must type password!");
    res.redirect("/login/create");
  } else if (post.pwd !== post.pwd2) {
    req.flash("error", "Password must same!");
    res.redirect("/login/create");
  } else if (post.id === "") {
    req.flash("error", "Must type ID!");
    res.redirect("/login/create");
  } else {
    db.query("SELECT id FROM users WHERE id=?", [post.id], function (
      error,
      user
    ) {
      if (error) {
        next(error);
      } else if (user != "") {
        req.flash("error", "You must change your ID");
        res.redirect("/login/create");
      } else {
        bcryptjs.hash(post.pwd, 10, function (err, hash) {
          if (err) {
            console.log(err);
          } else {
            db.query(
              "INSERT INTO users VALUES(?,?)",
              [post.id, hash],
              function (error2, result) {
                if (error2) {
                  console.log(error2);
                } else {
                  var user = {
                    id: post.id,
                    pwd: hash,
                  };
                  req.login(user, function (err) {
                    res.redirect("/");
                  });
                }
              }
            );
          }
        });
      }
    });
  }
});

module.exports = router;
