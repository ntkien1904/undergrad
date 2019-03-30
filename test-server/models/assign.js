var mongoose = require('mongoose');

// Booking Schema
var assignSchema = mongoose.Schema({
    name:{
        type: String,
		required: true
    },
    id:{
        type: String
    },
    phone:{
        type: String
    },
    inform:{
        type: String
    },
    drname:{
        type: String
    },
    draddress:{
        type: String
    },
    date:{
        type: String
    },
    time:{
        type: String
    },
    order:{
        type: Number,
        default: 0
    },
    meantime:{
        type: String
    }
});

var Assign = module.exports = mongoose.model('Assign', assignSchema);

// Get Schedule
module.exports.getAssigns = function(callback, limit){
	Assign.find(callback).limit(limit);
}

// Add Schedule
module.exports.addAssign = function(assign, callback){
	Assign.create(assign, callback);
}


// Delete Schedule
module.exports.removeAssign = function(id, callback){
	var query = {id: id};
	Assign.remove(query, callback);
}

/*
// Update Schedule
module.exports.updateAssign = function(id, assign, options, callback){
	var query = {id: id};
	var update = {
		id: schedule.id,
		date: schedule.date,
        time: schedule.time,
        quantity: schedule.quantity
	}
	Schedule.findOneAndUpdate(query, update, options, callback);
}
*/
