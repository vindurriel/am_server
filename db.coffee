mongo=require('mongodb')
Server = mongo.Server
Db = mongo.Db
BSON = mongo.BSONPure
server = new Server 'localhost', 27017, {auto_reconnect:true}
db = new Db 'test', server
module.exports.db=db
db.open (err, db)=>
  if (!err)
    console.log("Connected to database")
_collection= (name,fn) =>
  db.collection(name,fn)
module.exports.collection=_collection

module.exports.insert = (tname,obj,fn= =>)=>
  _collection tname, (err,collection)=>
    collection.insert obj, (err,res)=>

module.exports.upsert = (tname,spec,obj,fn=(err,res)=>)=>
  _collection tname, (err,collection)=>
    collection.update spec,obj,{
      upsert:true,
      multi:true,
      safe:false
    },fn

module.exports.update = (tname,spec,obj,option= {},fn= (err,res)=>)=>
  _collection tname, (err,collection)=>
    collection.update spec,obj,option,fn

module.exports.list = (tname,fn= (err,res)=>)=>
  _collection tname, (err,collection)=>
    collection.find().toArray fn