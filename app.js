var mongoose = require('mongoose')
    express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    Todo = require('./model/todo');

mongoose.connect('mongodb://localhost:27017/todo');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function callback () {
  console.log("Connected to mongodb");
});
    
app.configure(function(){
	app.use(express.bodyParser());
    app.use(app.router);
	app.use("/partials", express.static(__dirname + '/partials'));
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/js", express.static(__dirname+ '/js'));
	app.use("/lib", express.static(__dirname+ '/lib'));
});

app.get('/todo',function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/todo/api',function(req, res){
    Todo.find(function (err, todos) {
        if (err) {
            res.send(err);
        }
        res.send(todos);
    });    
});

app.get('/todo/api/:todo_id',function(req, res){
    Todo.findById(req.params.todo_id, function (err, todo) {
        if (err) {
            res.send(err);
        }
        res.send(todo);
    });    
});

app.post('/todo/api',function(req, res){
    Todo.create(req.body, function (err, todo) {
        if (err){
            res.send(err);
        }
	
		res.send(todo);	
    });
});

app.put('/todo/api/:todo_id',function(req, res){
    var query = { _id : req.params.todo_id };
	var updateData = {};
	for (var field in Todo.schema.paths) {
           if ((field !== '_id') && (field !== '__v')) {
              if (req.body[field] !== undefined) {
					updateData[field] = req.body[field];
              }
           }  
    } 
    Todo.update(query, updateData, function (err, numberAffected, raw) {
        if (err){
            res.send(err);
        }
		res.send(raw);	
    });
});

app.put('/todo/api',function(req, res){
	var query = {};
	for (var field in Todo.schema.paths) {
           if ((field !== '_id') && (field !== '__v')) {
              if (req.query[field] !== undefined) {
					query[field] = req.query[field];
              }
           }  
        } 
	var options = { multi : true };
    Todo.update(query, req.body, options ,function (err, numberAffected, raw) {
        if (err){
            res.send(err);
        }
		res.send(raw);	
    });
});

app.delete('/todo/api',function(req, res){
	var query = {};
	for (var field in Todo.schema.paths) {
        if ((field !== '_id') && (field !== '__v')) {
            if (req.query[field] !== undefined) {
				query[field] = req.query[field];
            }
        }  
    } 
    Todo.remove(query, function (err, numberAffected, raw) {
        if (err){
            res.send(err);
        }
		res.send(raw);
    });
});

app.listen(port);
console.log("Node listening on port " + port);



