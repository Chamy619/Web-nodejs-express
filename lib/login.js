const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

router.use(cookieParser("qlvsdfpjqvvxqlldkfjoi"));
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function (req, res) {
  var html = template.login("");
  res.send(html);
});

router.post("/process", function (req, res) {
  var post = req.body;
  db.query("SELECT pwd FROM user WHERE id=?", [post.id], function (error, pwd) {
    if (error) {
      next(error);
    }
    if (pwd == "") {
      var html = template.login("Login failed");
      res.send(html);
    } else if (post.pwd === pwd[0].pwd) {
      res.cookie("login", "success", { signed: true });
      res.redirect("/");
    } else {
      var html = template.login("Login failed");
      res.send(html);
    }
  });
});

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
