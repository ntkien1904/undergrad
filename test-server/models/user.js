var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
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
	ID:{
		type: String,
		required: true
	},
	birthdate:{
		type: String,
		required: true
	},
	gender:{
		type: String
	},
	address:{
		type: String
	},
	phone:{
		type: String
	},
	allergy:{
		type: String
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var User = module.exports = mongoose.model('User', userSchema);

// Get User
module.exports.getUsers = function(callback, limit){
	User.find(callback).limit(limit);
}

// Get User by id
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Add User
module.exports.addUser = function(user, callback){
	User.create(user, callback);
}

// Update User
module.exports.updateUser = function(id, user, options, callback){
	var query = {ID: id};
	var update = {
		username: user.username,
		password: user.password,
		name: user.name,
		ID: user.ID,
		birthdate: user.birthdate,
		gender: user.gender,
		address: user.address,
		phone: user.phone,
		allergy: user.allergy
	}
	User.findOneAndUpdate(query, update, options, callback);
}

// Delete User
module.exports.removeUser = function(id, callback){
	var query = {_id: id};
	User.remove(query, callback);
}
