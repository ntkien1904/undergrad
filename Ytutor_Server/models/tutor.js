var mongoose = require('mongoose');

// Tutor Schema
var tutorSchema = mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    profile:{
        type: String
    },
    schedule:{
        type: String
    },
    certificate:{
        type: String
    },
    prefered_area:{
        type: String
    }
});

var Tutor = module.exports = mongoose.model('Tutor', tutorSchema);

// Get Tutor
module.exports.getTutors = function(callback, limit){
	Tutor.find(callback).limit(limit);
}

// Add Tutor
module.exports.addTutor = function(tutor, callback){
	Tutor.create(tutor, callback);
}

// Delete Tutor
module.exports.removeTutor = function(id, callback){
	var query = {id: id};
	Tutor.remove(query, callback);
}

// Update Tutor
module.exports.updateTutor = function(id, tutor, options, callback){
	var query = {id: id};
	var update = {
        prefered_area: tutor.prefered_area,
        profile: tutor.profile,
        schedule: tutor.schedule,
        certificate: tutor.certificate
	}
	Tutor.findOneAndUpdate(query, update, options, callback);
}
