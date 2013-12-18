var express = require('express'),
    app = express(),
    port = 8000;
	
app.configure(function(){
    app.use(app.router);
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/lib", express.static(__dirname+ '/lib'));
	app.use("/js", express.static(__dirname+ '/js'));
});

app.get('/todo',function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.listen(port);
console.log("Node listening on port " + port);