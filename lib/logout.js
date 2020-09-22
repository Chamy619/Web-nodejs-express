const express = require("express");
const router = express.Router();
const session = require("express-session");
const mysqlstore = require("express-mysql-session")(session);
const options = {
  host: "localhost",
  port: 3307,
  user: "root",
  password: "111111",
  database: "opentutorials",
};
const sessionStore = new mysqlstore(options);

router.use(
  session({
    secret: "asdfzxcvqwerpou",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

router.get("/", function (req, res) {
  req.logout();
  req.session.save(function (err) {
    res.redirect("/");
  });
});

module.exports = router;
