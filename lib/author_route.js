const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");

function isLogin(req, res) {
  if (req.user) {
    return true;
  } else {
    return false;
  }
}

function logButton(req, res) {
  var button = `<a href="/login">login</a>`;
  if (isLogin(req, res)) {
    button = `${req.user[0].id}님 환영합니다 || <a href="/logout">logout</a>`;
  }
  return button;
}

router.get("", function (req, res) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) {
      next(error);
    }
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) {
        next(error2);
      }
      var title = "Author List";
      var list = template.list(topics);
      var html = template.html(
        title,
        list,
        `<h2>${title}</h2>
                ${template.table(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
        ``,
        logButton(req, res)
      );
      res.send(html);
    });
  });
});

router.post("/create_process", function (req, res) {
  var post = req.body;
  db.query(
    "INSERT INTO author(name, profile) VALUES (?, ?)",
    [post.name, post.profile],
    function (error, result) {
      if (error) {
        next(error);
      }
      res.redirect("/author");
    }
  );
});

router.get("/update/:id", function (req, res) {
  var params = req.params;
  var id = params.id;
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) {
      next(error);
    }
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) {
        next(error2);
      }
      db.query(`SELECT * FROM author WHERE id=?`, [id], function (
        error3,
        author
      ) {
        if (error3) {
          next(error3);
        }
        if (author == "") {
          res.send(404);
        }
        title = "Author List";
        var list = template.list(topics);
        var html = template.html(
          title,
          list,
          `<h2>${title}</h2>
                ${template.table(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${id}">
                        <input type="text" name="name" value="${
                          author[0].name
                        }">
                    </p>
                    <p>
                        <textarea name="profile">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
          ``,
          logButton(req, res)
        );
        res.send(html);
      });
    });
  });
});

router.post("/update_process", function (req, res) {
  var post = req.body;
  db.query(
    `UPDATE author SET name=?, profile=? WHERE id=?`,
    [post.name, post.profile, post.id],
    function (error, result) {
      if (error) {
        next(error);
      }
      res.redirect("/author");
    }
  );
});

router.post("/delete", function (req, res) {
  var post = req.body;
  db.query("DELETE FROM author WHERE id=?", [post.id], function (
    error,
    result
  ) {
    if (error) {
      next(error);
    }
    res.redirect("/author");
  });
});

module.exports = router;
