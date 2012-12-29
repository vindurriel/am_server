path=require('path')
dir=path.dirname(process.argv[1])
process.chdir(dir)
express = require('express')
routes = require('./routes')
http = require('http')

app = express()

app.configure  ()=>
  app.set('port', process.env.PORT || 30000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use (req, res, next)=>
    res.contentType('application/json')
    next() 
  app.use(app.router)
  app.use(require('less-middleware')({ src: __dirname + '/public' }))
  app.use(express.static(path.join(__dirname, 'public')))

app.configure 'development', ()=>
  app.use(express.errorHandler()) 

#routes 
app.get('/', routes.messages.list)
app.get('/messages', routes.messages.list)
app.get('/messages/:id', routes.messages.get)
app.post('/messages', routes.messages.new)
app.put('/messages/:id', routes.messages.put)
app.delete('/messages/:id', routes.messages.delete)

app.listen app.get('port'), ()=>
  console.log("Express server listening on port " + app.get('port'))