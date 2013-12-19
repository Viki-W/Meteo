var fs = require('fs'),
	express = require('express'),
    app = express(),
	port = 8080;
	
app.configure(function(){
    app.use(app.router);
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/lib", express.static(__dirname+ '/lib'));
	app.use("/js", express.static(__dirname+ '/js'));
});

app.get('/todo',function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/todo/api',function(req, res){
	var filepath = __dirname + '/data.json';
	fs.readFile(filepath, 'utf-8',function (err, data) {
			if (err) {
				res.send(404);
				return;
			}
			res.send(data);
	});    
});

app.post('/todo/api',function(req, res){
	var body = "";
	req.on('data', function (chunk) {
		body += chunk;
	});
	req.on('end', function () {
		var filepath = __dirname + '/data.json';	
		fs.writeFile(filepath,body,function(err){
			if (err) {
				res.send(500);
				return;
			}
		});
		res.send(body);
	});
});

app.listen(port);
console.log("Node listening on port " + port);



