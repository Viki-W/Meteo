var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    summary: String,
	done: Boolean,
	archived: Boolean
})
module.exports = mongoose.model('Todo', todoSchema, 'todo');