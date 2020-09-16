const express = require("express");
const app = express();
const url = require("url");
const topic = require("./lib/topic");
const author = require("./lib/author");
const bodyParser = require("body-parser");
const compression = require("compression");
const topicRouter = require("./lib/topic_route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use("/", topicRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000);

/*
var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
        if(queryData.id === undefined) {
            topic.home(request, response);}
        else {
           topic.page(request, response);}
    }
    else if(pathname === '/create') {
        topic.create(request, response);}
    else if(pathname === '/create_process') {
        topic.create_process(request, response);}
    else if(pathname === '/update') {
        topic.update(request, response);}
    else if(pathname === '/update_process') {
        topic.update_process(request, response);}
    else if(pathname === '/delete_process') {
        topic.delete_process(request, response);}
    else if(pathname === '/author'){
        author.home(request, response);
    }
    else if(pathname === '/author/create_process'){
        author.create_process(request, response);
    }
    else if(pathname === '/author/update') {
        author.update(request, response);
    }
    else if(pathname === '/author/update_process') {
        author.update_process(request, response);
    }
    else if(pathname === '/author/delete') {
        author.delete(request, response);
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
*/
