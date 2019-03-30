var mongoose = require('mongoose');

// Form Schema
var formSchema = mongoose.Schema({
    name:{
        type: String,
		required: true
    },
    id:{
        type: String,
		required: true
    },
    drname:{
        type: String,
        required: true
    },
	manifest:{
		type: String
	},

    diagnosis:{
		type: String
	},
    
	prescription:{
		type: String
	},
	note:{
		type: String
	},

	create_date:{
		type: Date,
		default: Date.now
    }
});

var Form = module.exports = mongoose.model('Form', formSchema);

// Get Form
module.exports.getForms = function(callback, limit){
	Form.find(callback).limit(limit);
}

// Add Form
module.exports.addForm = function(form, callback){
	Form.create(form, callback);
}

// Delete Form
module.exports.removeForm = function(id, callback){
	var query = {id: id};
	Form.remove(query, callback);
}