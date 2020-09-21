const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

function isLogin(req, res) {
  var cookie = req.cookies;
  if (cookie.login) {
    return true;
  }
  return false;
}

function logButton(req, res) {
  var button = `<a href="/logout">logout</a>`;
  if (isLogin(req, res)) {
    button = `<a href="/login">login</a>`;
  }
  return button;
}

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function (req, res) {
  isLogin(req, res);
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
      res.cookie("login", "success");
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
    console.log(1);
    res.redirect("/login/create");
  }

  db.query("SELECT id FROM user WHERE id=?", [post.id], function (error, user) {
    if (error) {
      next(error);
    } else if (user != "") {
      console.log(user);
      res.redirect("/login/create");
    } else {
      db.query("INSERT INTO user VALUES(?,?)", [post.id, post.pwd], function (
        error2,
        result
      ) {
        if (error2) {
          next(error2);
        } else {
          console.log("회원가입성공");
          res.redirect("/login");
        }
      });
    }
  });
});

module.exports = router;
