var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
    id:{
        type: Number
    },
    username:{
        type: String,
		required: true
    },
    password:{
        type: String,
		required: true
    },
    name:{
        type: String,
		required: true
    },
    avatar:{
        type: String
    },
    email:{
        type: String
    },
    phone:{
        type: String
    },
    address:{
        type: String
    },
    type:{
        type: Number,
        required: true
    }
});

var User = module.exports = mongoose.model('User', userSchema);

// Get User
module.exports.getUsers = function(callback, limit){
	User.find(callback).limit(limit);
}

// Add User
module.exports.addUser = function(user, callback){
	User.create(user, callback);
}

// Delete User
module.exports.removeUser = function(id, callback){
	var query = {id: id};
	User.remove(query, callback);
}

// Update User
module.exports.updateUser = function(id, user, options, callback){
	var query = {id: id};
	var update = {
        id: user.id,
        username: user.username,
        password: user.password,
		name: user.name,
		avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        address: user.address
	}
	User.findOneAndUpdate(query, update, options, callback);
}
