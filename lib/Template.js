var sanitizeHTML = require("sanitize-html");
module.exports = {
  html: function (title, listText, body, control, loginStatus) {
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB2 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    ${loginStatus}
    <h1><a href="/">WEB</a></h1>
    <a href="/author">author</a>
    <ol>
        ${listText}
    </ol>
    ${control}
    ${body}
    </body>
    </html>
    `;
  },
  list: function (topics) {
    var list = topics;
    var listText = "";
    for (key in list) {
      listText += `<li><a href="/page/${list[key].id}">${sanitizeHTML(
        list[key].title
      )}</a></li>`;
    }
    return listText;
  },
  tag: function (authors, author_id) {
    var tag = `<select name='author'>`;
    for (author in authors) {
      var selected = "";
      if (authors[author].id === author_id) {
        selected += " selected";
      }
      tag += `<option value=${authors[author].id}${selected}>${sanitizeHTML(
        authors[author].name
      )}</option>`;
    }
    tag += "</select>";
    return tag;
  },
  table: function (authors) {
    var table = `<table><tr><th>title</th><th>profile</th><th>update</th><th>delete</th></tr>`;
    for (author in authors) {
      table += `<tr>
            <td>${sanitizeHTML(authors[author].name)}</td>
            <td>${sanitizeHTML(authors[author].profile)}</td>
            <td><a href="/author/update/${authors[author].id}">update</a></td>
            <td>
            <form action="/author/delete" method="post">
                <input type="hidden" name="id" value="${authors[author].id}">
                <input type="submit" value="delete">
            </form>
            </td></tr>`;
    }
    table += `</table>`;
    return table;
  },
  login: function (fail) {
    return `
    <!doctype html>
    <html>
    <head>
    <title>Login</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h2>Login</h2>
    <form action="/login/process" method="post">
      <p>
      <input type="text" name="id" placeholder="ID">
      </p>
      <p>
      <input type="password" name="pwd" placeholder="Password">
      <p>
      ${fail}
      <p><input type="submit"></p>
    </form>
    <a href="/login/create">회원가입</a>
    </body>
    </html>
    `;
  },
  create_form: function () {
    return `
    <!doctype html>
    <html>
    <head>
    <title>회원가입</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h2>회원가입</h2>
    <form action="/login/create_process" method="post">
    <p>
    <input type="text" name="id" placeholder="ID">
    </p>
    <p>
    <input type="password" name="pwd" placeholder="Password">
    <p>
    <p>
    <input type="password" name="pwd2" placeholder="Password">
    <p>
    <p><input type="submit"></p>
    </form>
    </body>
    </html>
    `;
  },
};
