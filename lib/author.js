var url = require('url');
var qs = require('querystring');
var db = require('./db');
var Template = require('./Template');

exports.home = function(request, response) {
    exports.home = function(request, response) {
        db.query('SELECT * FROM topic', function(error, topics, fields) {
            db.query('SELECT * FROM author', function(error2, authors) {
                title = 'Author List';
                var list = Template.list(topics);
                var html = Template.html(title,list,
                    `<h2>${title}</h2>
                    ${Template.table(authors)}
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
                    ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    }
}

exports.create_process = function(request, response) {
    var body='';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUE (?,?)`, [post.name, post.profile], function(error, result) {
            response.writeHead(302, {Location:`/author`});
            response.end();
        });
    });
}

exports.update = function(request, response) {
    console.log('hello');
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var id = queryData.id;
    db.query('SELECT * FROM topic', function(error, topics) {
        db.query('SELECT * FROM author',function(error2, authors) {
            db.query(`SELECT * FROM author WHERE id=?`, [id], function(error3, author) {
                title = 'Author List';
                var list = Template.list(topics);
                var html = Template.html(title,list,
                    `<h2>${title}</h2>
                    ${Template.table(authors)}
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
                            <input type="text" name="name" value="${author[0].name}">
                        </p>
                        <p>
                            <textarea name="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });  
}

exports.update_process = function(request, response) {
    var body='';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function() {
        var post=qs.parse(body);
        console.log(post);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, result) {
            console.log(result);
            response.writeHead(302, {location:`/author`});
            response.end();
        });
    });
}

exports.delete = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        db.query('DELETE FROM author WHERE id=?', [post.id], function(error, result) {
            console.log(result);
            response.writeHead(302, {Location: '/author'});
            response.end();
        });
    });
}