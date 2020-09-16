var url = require("url");
var qs = require("querystring");
var sanitizeHTML = require("sanitize-html");
var db = require("./db");
var Template = require("./Template");
var express = require("express");
var router = express.Router();
var bodyparser = require("body-parser");

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));

exports.home = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics, fields) {
    title = "Welcome";
    var description = "Hello NodeJS";
    var list = Template.list(topics);
    var html = Template.html(
      title,
      list,
      `<h2>${sanitizeHTML(title)}</h2>${sanitizeHTML(description)}`,
      `<a href="create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  /*
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  */
  var params = request.params;
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) {
      response.writeHead(404);
      response.end("Sorry can't find that!");
    }
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [params.id],
      function (error2, topic) {
        if (error2) {
          response.writeHead(404);
          response.end("Sorry can't find that!");
        }
        title = topic[0].title;
        var name = topic[0].name;
        var description = topic[0].description;
        var list = Template.list(topics);
        var html = Template.html(
          title,
          list,
          `<h2>${sanitizeHTML(title)}</h2>${sanitizeHTML(description)}
                <p>by ${name}</P>`,
          `<a href="/create">create</a>
                <a href="/update/${params.id}">update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${params.id}">
                    <input type="submit" value="delete">
                </form>
                `
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;
      var title = "Create";
      var listText = Template.list(topics);
      var tag = Template.tag(authors);
      var html = Template.html(
        title,
        listText,
        ``,
        `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p>
                    ${tag}
                </P>
                <p><input type="submit"></p>
                </form>
            `
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var title = sanitizeHTML(post.title);
    var author_id = post.author;
    var description = sanitizeHTML(post.description);
    var dbString = `INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(),?)`;
    db.query(dbString, [title, description, author_id], function (
      error,
      result
    ) {
      if (error) throw error;
      var locId = result.insertId;
      response.writeHead(302, { Location: `/?id=${sanitizeHTML(locId)}` });
      response.end();
    });
  });
};

exports.update = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics) {
    db.query("SELECT * FROM topic WHERE id=?", [params.id], function (
      error2,
      topic
    ) {
      db.query("SELECT * FROM author", function (error3, authors) {
        var tag = Template.tag(authors, topic[0].author_id);
        var listText = Template.list(topics);
        var title = topic[0].title;
        var html = Template.html(
          title,
          listText,
          `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${sanitizeHTML(
                      params.id
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
          `<a href="/create">create</a> <a href="/update/${params.id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var id = post.id;
    var newTitle = post.title;
    var description = post.description;
    var author_id = post.author;
    var dbquery = `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`;
    db.query(dbquery, [newTitle, description, author_id, id], function (
      error,
      result
    ) {
      if (error) throw error;
      response.writeHead(302, { Location: `/?id=${sanitizeHTML(id)}` });
      response.end();
    });
  });
};

exports.delete_process = function (request, response, id) {
  /*
  var body = "";
  request.on("data", function (data) {
    body += data;
  });
  */
  //request.on("end", function () {
  db.query("DELETE FROM topic WHERE id=?", [id], function (error, result) {
    if (error) throw error;
    response.writeHead(302, { Location: `/` });
    response.end();
  });
  //});
};
