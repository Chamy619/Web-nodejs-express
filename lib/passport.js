var db = require("./db");

module.exports = function (router) {
  var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

  router.use(passport.initialize());
  router.use(passport.session());

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.query("SELECT * FROM user WHERE id=?", [id], function (error, user) {
      if (error) {
        next();
      }
      if (user.length === 0) {
        return done(null, false, { message: "Incorrect session" });
      } else {
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
  return passport;
};
