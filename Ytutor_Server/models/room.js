var mongoose = require('mongoose');

// Room Schema
var roomSchema = mongoose.Schema({
    room:{
        type: String
    },
    learner_id:{
        type: String
    },
    tutor_id:{
        type: String
    },
    learner_name:{
        type: String
    },
    tutor_name:{
        type: String
    },
    create_date:{
		type: Date,
		default: Date.now
	}
});

var Room = module.exports = mongoose.model('Room', roomSchema);

// Get Room
module.exports.getRooms = function(callback, limit){
	Room.find(callback).limit(limit);
}

// Add Room
module.exports.addRoom = function(room, callback){
	Room.create(room, callback);
}

// Delete Room
module.exports.removeRoom = function(room, callback){
	var query = {room: room};
	Room.remove(query, callback);
}


