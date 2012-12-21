// Generated by CoffeeScript 1.4.0
var app, dir, express, http, path, routes,
  _this = this;

path = require('path');

dir = path.dirname(process.argv[1]);

process.chdir(dir);

express = require('express');

routes = require('./routes');

http = require('http');

app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({
    src: __dirname + '/public'
  }));
  app.use(express["static"](path.join(__dirname, 'public')));
  return app.use(function(req, res, next) {
    res.contentType('application/json');
    return next();
  });
});

app.configure('development', function() {
  return app.use(express.errorHandler());
});

app.get('/messages', routes.messages.list);

app.post('/messages', routes.messages["new"]);

app.get('/messages/flush', routes.messages["delete"]);

app.get('/messages/:id', routes.messages.get);

app.put('/messages/:id', routes.messages.put);

app["delete"]('/messages/:id', routes.messages["delete"]);

app.listen(app.get('port'), function() {
  return console.log("Express server listening on port " + app.get('port'));
});
