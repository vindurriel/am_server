Db=require('../db')
db=Db.db
module.exports.list= (req,res) =>
	Db.list "test", (err,col)=>
		res.send col
module.exports.new= (req,res)=>
	data=req.body
	db= Db.db
	console.log data
	db.collection 'test',(err,collection)=>
		collection.insert data,{safe:true},(err,r)=>
			if err
				res.send {"result":"error",'error_msg':"invalid data"}
			else
				res.send {"result":"ok"}
module.exports.delete=	(req,res) =>
	data=req.params
	console.log data
	db.collection 'test',(err,collection)=>
		collection.remove (err,r)=>
			if err
				res.send {"result":"error",'error_msg':"invalid data"}
			else
				res.send {"result":"ok"}
module.exports.put=	(req,res) =>
	data=req.params
	console.log data
	res.send "ok"
module.exports.get=	(req,res) =>
	data=req.params.id
	console.log data
	db.collection 'test',(err,collection)=>
		collection.findOne {'User':data},(err,r)=>
			if err
				res.send   {"result":"error",'error_msg':"invalid data"}
			else
				console.log(r)
				res.send   {"result":"ok",'data':r}