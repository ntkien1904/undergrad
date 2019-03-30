var mongoose = require('mongoose');

// Chat Schema
var chatSchema = mongoose.Schema({
    room:{
        type: String
    },
    sender:{
        type: String
    },
    text:{
        type: String
    },
    create_date:{
		type: Date,
		default: Date.now
	}
});

var Chat = module.exports = mongoose.model('Chat', chatSchema);

// Get Chat
module.exports.getChats = function(callback, limit){
	Chat.find(callback).limit(limit);
}

// Add Chat
module.exports.addChat = function(chat, callback){
	Chat.create(chat, callback);
}

// Delete Chat
module.exports.removeChat = function(room, callback){
	var query = {room: room};
	Chat.remove(query, callback);
}


