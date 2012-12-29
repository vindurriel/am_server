fs=require("fs")
dbName= "am-db"
mongo=require('mongodb')
Server = mongo.Server
Db = mongo.Db
server = new Server '192.168.4.182', 27017, {auto_reconnect:true,w:1}
db = new Db 'test', server
fs.readFile './content.txt', "utf-8", (err,data)=>
	db.open (err, db)=>
		db.collection dbName, (err,collection)=>
			collection.find {}, 
				{"content":0,"_id":0},
				{limit:1}, 
				(err,res)=>
					res.toArray (err,res)=>
						console.log res
						process.exit