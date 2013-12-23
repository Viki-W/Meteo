﻿var mongoose = require('mongoose')
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
    app.use("/css", express.static(__dirname + '/view/css'));
    app.use("/js", express.static(__dirname+ '/view'));
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
    Todo.create(req.body, function (err) {
        if (err){
            res.send(err);
        }
		Todo.find(function (err, todos) {
			if (err) {
				res.send(err);
			}
			res.send(todos);
		});  
		
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
    Todo.update(query, updateData, function (err) {
        if (err){
            res.send(err);
        }
		Todo.find(function (err, todos) {
			if (err) {
				res.send(err);
			}
			res.send(todos);
		});  
    });

});

app.delete('/todo/api',function(req, res){
	var query = { done : true }; 
    Todo.remove(query, function (err) {
        if (err){
            res.send(err);
        }
		Todo.find(function (err, todos) {
			if (err) {
				res.send(err);
			}
			res.send(todos);
		});  
    });
});

app.listen(port);
console.log("Node listening on port " + port);



