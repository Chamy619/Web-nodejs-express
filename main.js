const express = require("express");
const app = express();
const compression = require("compression");
const topicRouter = require("./lib/topic_route");
const authorRouter = require("./lib/author_route");
const loginRouter = require("./lib/login");
const logoutRouter = require("./lib/logout");
const helmet = require("helmet");

app.use(helmet());
app.use(compression());

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use("/", topicRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/author", authorRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000);
