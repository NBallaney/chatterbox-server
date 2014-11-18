/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var url = require("url");
var fs = require("fs");
var _ = require("underscore");

var server = {
  messageCount: 1,
  data: {
    results: [{
      "username": "host",
      "text": "get chatting bish",
      "roomname": "lobby",
      "objectId": 0,
      "createdAt": new Date()
    }]
  }
};

var requestHandler = function(request, response) {

  // message on request
  console.log("Serving request type " + request.method + " for url " + request.url);

  // set status code and CORS headers
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/JSON";

  // specify valid URLs
  var parsedURL = url.parse(request.url);
  var accessableURLs = ["/classes/room1", "/classes/messages"];

  // handle invalid requests
  if (accessableURLs.indexOf(parsedURL.pathname) === -1) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }

  // handle POST requests
  if (request.method === "POST") {

    request.on('data', function(chunk){
      var msg = JSON.parse(chunk);
      msg.objectId = server.messageCount;
      msg.createdAt = new Date();
      server.messageCount++;
      server.data.results.push(msg);
    });

    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end();

  // handle GET requests
  } else if (request.method === "GET") {

    // sort by reverse chronological order if specified in request
    if (parsedURL.href.split("=")[1] === "-createdAt") {
      server.data.results.sort(function(a,b){
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
    }
    console.log(server.data);
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(server.data));

  }

  // flush response
  response.writeHead(statusCode, headers);
  response.end();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
