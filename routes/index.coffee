fs = require("fs")
path=require("path")
files = fs.readdirSync("./routes")
for f in files
	if path.extname(f)=='.js' and f!="index.js"
		name= "./"+f
		module.exports[path.basename(f,'.js')]=require(name)
module.exports.index= (req,res)=>
	res.render "net", {"title":"asdf"}