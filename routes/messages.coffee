Db=require('../db')
db=Db.db
dbName= "am-db"
low_key= (obj)=>
	res={}
	for k,v of obj
		res[k.toLowerCase()]=v
	return res
parse_date= (input)=>
	parts = input.match(/(\d+)/g)
	[year,month,day,h,m,s]=(x for x in parts)
	return new Date(year,month-1,day,h,m,s,0)
module.exports.list= (req,res) =>
	username=req.query.user
	tags=req.query.tags
	query={}
	options={}
	lim= 100
	if req.query.limit?
		lim=req.query.limit
		lim=parseInt lim
		if lim >100
			lim =100
	if username?
		query.user= username
	if tags?
		tags=(x for x in tags.split(','))
		query.tags= {$in:tags}
	if req.query.before? or req.query.after? 
		[before,after]=[req.query.before,req.query.after]
		query.created_on={}
		if before?
			query.created_on.$lte=parse_date(before)
		if after?
			query.created_on.$gte=parse_date(after)
	console.log req.query
	db.collection dbName,{w:1},(err,collection)=>   
		collection.find(query).sort({"created_on",-1}),limit(lim).toArray (err,r)=>
			if err
				res.send {"result":"error",'error_msg':"invalid data"}
			else
				items=r
				res.send {"result":"ok",'messages':items}
module.exports.new= (req,res)=>
	console.log "new message"
	req.body=low_key(req.body)
	console.log req.body
	token=req.body.token
	messages= req.body.messages
	user= req.body.user
	db.collection dbName,(err,collection)=>
		for message in messages
			data=low_key(message)
			data.created_on=new Date()
			data.user= user
			console.log data
			collection.insert data,{safe:true},(err,r)=>
				if err
					res.send {"result":"error",'error_msg':"invalid data"}
				else
					res.send {"result":"ok"}
module.exports.delete=	(req,res) =>
	data=req.params
	console.log data
	db.collection dbName,(err,collection)=>
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
	db.collection dbName,(err,collection)=>
		collection.findOne {'User':data},(err,r)=>
			if err
				res.send   {"result":"error",'error_msg':"invalid data"}
			else
				console.log(r)
				res.send   {"result":"ok",'data':r}