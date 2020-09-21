const sanitizeHTML = require("sanitize-html");
const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

function isLogin(req, res) {
  var cookie = req.signedCookies;
  if (cookie.login === "success") {
    return true;
  }
  return false;
}

function logButton(req, res) {
  var button = `<a href="/login">login</a>`;
  if (isLogin(req, res)) {
    button = `<a href="/logout">logout</a>`;
  }
  return button;
}

router.use(cookieParser("qlvsdfpjqvvxqlldkfjoi"));
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", function (req, res) {
  db.query("SELECT id, title FROM topic", function (error, topics) {
    if (error) {
      res.send(404, "Sorry can't find that!");
    }
    var list = template.list(topics);
    var html = template.html(
      "Web",
      list,
      `<h2>Welcome</h2>Hello`,
      `<a href='/create'> create </a>`,
      logButton(req, res)
    );
    res.send(html);
  });
});

router.get("/page/:id", function (req, res) {
  db.query("SELECT title, id FROM topic", function (error, topics) {
    if (error) {
      next(error);
    }
    var list = template.list(topics);
    var param = req.params;
    var id = param.id;
    db.query(
      "SELECT title, description, name FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?",
      [id],
      function (error2, topic_author) {
        if (error2) {
          next(error2);
        }
        if (topic_author == "") {
          res.send(404);
        }
        var title = topic_author[0].title;
        var description = topic_author[0].description;
        var name = topic_author[0].name;
        var html = template.html(
          title,
          list,
          `<h2>${sanitizeHTML(title)}</h2>${sanitizeHTML(description)}
                  <p>by ${name}</P>`,
          `<a href="/create">create</a>
            <a href="/update/${id}">update</a>
            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <input type="submit" value="delete">
            </form>,
            `,
          logButton(req, res)
        );
        res.send(html);
      }
    );
  });
});

router.get("/create", function (req, res) {
  db.query("SELECT title, id FROM topic", function (error, topics) {
    if (error) {
      next(error);
    }
    var list = template.list(topics);
    db.query("SELECT name, id FROM author", function (error2, authors) {
      if (error2) {
        next(error2);
      }
      var authorList = template.tag(authors);
      var title = "Create";
      var html = template.html(
        title,
        list,
        ``,
        `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p>
                    ${authorList}
                </P>
                <p><input type="submit"></p>
                </form>
            `,
        logButton(req, res)
      );
      res.send(html);
    });
  });
});

router.post("/create_process", function (req, res) {
  var post = req.body;
  var title = sanitizeHTML(post.title);
  var author_id = post.author;
  var description = sanitizeHTML(post.description);
  var dbString = `INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(),?)`;
  db.query(dbString, [title, description, author_id], function (error, result) {
    if (error) {
      next(error);
    }
    var locId = result.insertId;
    res.redirect(`/page/${locId}`);
  });
});

router.get("/update/:id", function (req, res) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) {
      next(error);
    }
    db.query("SELECT * FROM topic WHERE id=?", [req.params.id], function (
      error2,
      topic
    ) {
      if (error2) {
        next(error2);
      }
      db.query("SELECT * FROM author", function (error3, authors) {
        var tag = template.tag(authors, topic[0].author_id);
        var listText = template.list(topics);
        var title = topic[0].title;
        var html = template.html(
          title,
          listText,
          `
                        <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${sanitizeHTML(
                          req.params.id
                        )}">
                        <p><input type="text" name="title" placeholder="title" value=${sanitizeHTML(
                          topic[0].title
                        )}></p>
                        <p><textarea name="description" placeholder="description">${sanitizeHTML(
                          topic[0].description
                        )}</textarea></p>
                        <p>${tag}</p>
                        <p><input type="submit"></p>
                        </form>`,
          `<a href="/create">create</a>`,
          logButton(req, res)
        );
        res.send(html);
      });
    });
  });
});

router.post("/update_process", function (req, res) {
  var post = req.body;
  var id = post.id;
  var newTitle = post.title;
  var description = post.description;
  var author_id = post.author;
  var dbquery = `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`;
  db.query(dbquery, [newTitle, description, author_id, id], function (
    error,
    result
  ) {
    if (error) {
      next(error);
    }
    res.redirect(`/page/${sanitizeHTML(id)}`);
  });
});

router.post("/delete_process", function (req, res) {
  var post = req.body;
  console.log(post);
  var id = post.id;
  db.query("DELETE FROM topic WHERE id=?", [id], function (error, result) {
    if (error) {
      next(error);
    }
    res.redirect("/");
  });
});

module.exports = router;
