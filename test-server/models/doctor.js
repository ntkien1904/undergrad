var mongoose = require('mongoose');

// Form Schema
var doctorSchema = mongoose.Schema({
    name:{
        type: String,
		required: true
    },
    id:{
        type: String,
		required: true
    },
    image:{
        type: String
    },
	department:{
        type: String
    },
    address:{
        type: String
    },
    longlat:{
        type: String
    },
    profile:{
        type: String
    },
    schedule:{
        type: String
    }
});

var Doctor = module.exports = mongoose.model('Doctor', doctorSchema);

// Get Doctor
module.exports.getDoctors = function(callback, limit){
	Doctor.find(callback).limit(limit);
}

// Add Doctor
module.exports.addDoctor = function(doctor, callback){
	Doctor.create(doctor, callback);
}

// Delete Doctor
module.exports.removeDoctor = function(id, callback){
	var query = {_id: id};
	Doctor.remove(query, callback);
}

// Update Doctor
module.exports.updateDoctor = function(id, doctor, options, callback){
	var query = {id: id};
	var update = {
		name: doctor.name,
		id: doctor.id,
		image: doctor.image,
        department: doctor.department,
        address: doctor.address,
        longlat: doctor.longlat,
        profile: doctor.profile,
        schedule: doctor.schedule
	}
	Doctor.findOneAndUpdate(query, update, options, callback);
}
