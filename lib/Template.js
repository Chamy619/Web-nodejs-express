var sanitizeHTML = require("sanitize-html");
module.exports = {
  html: function (title, listText, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB2 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
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
            <td><a href="/author/update?id=${
              authors[author].id
            }">update</a></td>
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
};
