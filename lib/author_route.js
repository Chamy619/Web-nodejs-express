const express = require("express");
const router = express.Router();
const db = require("./db");
const template = require("./Template");

router.get("", function (req, res) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) {
      res.send(404, "Sorry can't find that!");
    }
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) {
        res.send(404, "Sorry can't find that!");
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
        ``
      );
      res.send(html);
    });
  });
});

module.exports = router;
