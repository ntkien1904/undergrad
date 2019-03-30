var mongoose = require('mongoose');

// Schedule Schema
var scheduleSchema = mongoose.Schema({
    id:{
        type: String,
		required: true
    },
    date:{
        type: String,
        required: true 
    },
    time:{
        type: String
    },
	quantity:{
        type: Number,
        default: 0
    }
});

var Schedule = module.exports = mongoose.model('Schedule', scheduleSchema);

// Get Schedule
module.exports.getSchedules = function(callback, limit){
	Schedule.find(callback).limit(limit);
}

// Add Schedule
module.exports.addSchedule = function(schedule, callback){
	Schedule.create(schedule, callback);
}

// Delete Schedule
module.exports.removeSchedule = function(id, callback){
	var query = {id: id};
	Schedule.remove(query, callback);
}

// Update Schedule
module.exports.updateSchedule = function(id, schedule, options, callback){
	var query = {id: id};
	var update = {
		id: schedule.id,
		date: schedule.date,
        time: schedule.time,
        quantity: schedule.quantity
	}
	Schedule.findOneAndUpdate(query, update, options, callback);
}
