var mongoose = require('mongoose');

// Schedule Schema
var rateSchema = mongoose.Schema({
    id:{
        type: String,
		required: true
    },
    username:{
        type: String,
        required: true 
    },
    comment:{
        type: String
    },
	point:{
        type: String
    },
    create_date:{
		type: Date,
		default: Date.now
	}
});

var Rate = module.exports = mongoose.model('Rate', rateSchema);

// Get rate
module.exports.getRates = function(callback, limit){
	Rate.find(callback).limit(limit);
}

// Add rate
module.exports.addRate = function(rate, callback){
	Rate.create(rate, callback);
}

// Delete rate
module.exports.removeRate = function(id, callback){
	var query = {id: id};
	Rate.remove(query, callback);
}


