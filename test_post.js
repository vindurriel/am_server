var http = require('http');
var postObject = {
  "User": "12",
  "token": "123", //将来验证用
  "messages": [{
    "title": "<title>",
    "description": "<description>",
    "tags": ["<tag1>", "<tag2>"],
    "links": ["http://link1", "http://link2"],
    "pictures": ["http://img1.jpg", "http://img2.jpg"]
  }]
};

var userString = JSON.stringify(postObject);
var headers = {
  'Content-Type': 'application/json',
  'Content-Length': userString.length
};
var options = {
  host: '192.168.4.182',
  port: 30000,
  path: '/messages',
  method: 'POST',
  headers: headers
};

var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
  });

  res.on('end', function() {
    console.log(responseString);
  });
});
req.on('error', function(e) {
  throw e;
});
req.write(userString);
req.end();