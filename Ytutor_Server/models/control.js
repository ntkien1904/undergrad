var mongoose = require('mongoose');

// Control Schema
var controlSchema = mongoose.Schema({
    num:{
        type: Number,
        default: 0
    } 
});

var Control = module.exports = mongoose.model('Control', controlSchema);

// Get control
module.exports.getControl = function(callback, limit){
	Control.find(callback).limit(limit);
}

// Add control
module.exports.addControl = function(control, callback){
	Control.create(control, callback);
}

// Update control
module.exports.updateControl = function(id, control, options, callback){
	var query = {_id: id};
	var update = {
        num: control.num
	}
	Control.findOneAndUpdate(query, update, options, callback);
}


