const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", function (req, res) {
  res.clearCookie("login");
  res.redirect("/");
});

module.exports = router;
