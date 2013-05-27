var http = require('http');
var postObject = {
  "User": "vindurriel",
  "Token": "123", //将来验证用
  "Messages": [{
    "Title": "标题 3",
    "Description": "描述3",
    "Tags": ["sport", "beauty"],
    "Links": ["http://link1", "http://link2"],
    "content":"adsfsdfdsfasdffffffffffffffffffffff",
    "Pictures": ["http://img1.jpg", "http://img2.jpg"],
  }
  ]
};

var userString = JSON.stringify(postObject)
var headers = {
  'Content-Type': 'application/json; charset=utf-8',
  // 'Content-Length': userString.length,
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
console.log (userString)
req.write(userString);
req.end();