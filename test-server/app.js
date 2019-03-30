var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.json());

Rate = require('./models/rate.js')
Assign = require('./models/assign.js');
Schedule = require('./models/schedule.js');
Doctor = require('./models/doctor.js');
User = require('./models/user.js');
Form = require('./models/form.js');

// Connect to Mongoose
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test-server');
var db = mongoose.connection;

/*
var morgan = require('morgan');
app.use(morgan('dev'));

function auth (req, res, next) {
    console.log(req.headers);
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
        return;
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user == 'admin' && pass == 'password') {
        //next(); // authorized
        //res.send("Hello.");
        next();
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
    }
}

app.use(auth);

app.use(express.static(__dirname + '/public'));


app.use(function(err,req,res,next) {
            res.writeHead(err.status || 500, {
            'WWW-Authenticate': 'Basic',
            'Content-Type': 'text/plain'
        });
        res.end(err.message);
});
*/

app.get('/', function(req, res){
	res.send('Hello');
});

app.get('/api/users',function(req,res){
	User.getUsers(function(err,users){
		if(err){
			throw err;
		}
		res.json(users);
	});
});

app.get('/', function(req, res){
	res.send('Please use1 /api/books or /api/genres');
});

app.get('/api/users/:username&:password', function(req, res){
	User.find({username: req.params.username,password: req.params.password}, function(err, user) {
		if(err) {
			res.send("fail");
		} else {
			console.log(user);
			res.json(user);
		}
	})
});

app.post('/api/users', function(req, res){
	var user = req.body;
	User.addUser(user, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

app.put('/api/users/:ID', function(req, res){
	var id = req.params.ID;
	var user = req.body;
	User.updateUser(id, user, {}, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

app.delete('/api/users/:_id', function(req, res){
	var id = req.params._id;
	User.removeUser(id, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// Form

app.get('/api/forms',function(req,res){
	Form.getForms(function(err,forms){
		if(err){
			throw err;
		}
		res.json(forms);
	});
});

/*
app.get('/api/formsid',function(req,res){
	Form.find({id: req.query.id}, function(err, doc) {
		if(err) {
			res.send("fail");
		} else {
			//console.log(doc);
			res.json(doc);
		}
	})
});
*/

app.get('/api/forms/:id',function(req,res){
	Form.find({id: req.params.id}, function(err, docs) {
		if(err) {
			res.send("fail");
		} else {
			//console.log(doc);
			res.json(docs);
		}
	})
});

app.post('/api/forms', function(req, res){
	var form = req.body;
	Form.addForm(form, function(err, form){
		if(err){
			throw err;
		}
		res.json(form);
	});
});

app.delete('/api/forms/:id', function(req, res){
	var id = req.params.id;
	Form.removeForm(id, function(err, form){
		if(err){
			throw err;
		}
		res.json(form);
	});
});

//Doctor
app.get('/api/doctors',function(req,res){
	Doctor.getDoctors(function(err,doctors){
		if(err){
			throw err;
		}
		res.json(doctors);
	});
});

app.post('/api/doctors', function(req, res){
	var doctor = req.body;
	Doctor.addDoctor(doctor, function(err, doctor){
		if(err){
			throw err;
		}
		res.json(doctor);
	});
});

app.delete('/api/doctors/:id', function(req, res){
	var id = req.params.id;
	Doctor.removeDoctor(id, function(err, doctor){
		if(err){
			throw err;
		}
		res.json(doctor);
	});
});

app.put('/api/doctors/:id', function(req, res){
	var id = req.params.id;
	var doctor = req.body;
	Doctor.updateDoctor(id, doctor, {}, function(err, doctor){
		if(err){
			throw err;
		}
		res.json(doctor);
	});
});

//Schedule
app.get('/api/schedules',function(req,res){
	Schedule.getSchedules(function(err,schedules){
		if(err){
			throw err;
		}
		res.json(schedules);
	});
});


app.get('/api/schedules/:id',function(req,res){
	Schedule.find({id: req.params.id}, function(err, docs) {
		if(err) {
			res.send("fail");
		} else {
			//console.log(doc);
			res.json(docs);
		}
	})
});

app.post('/api/schedules', function(req, res){
	var schedule = req.body;
	Schedule.addSchedule(schedule, function(err, schedule){
		if(err){
			throw err;
		}
		res.json(schedule);
	});
});

app.delete('/api/schedules/:id', function(req, res){
	var id = req.params.id;
	Schedule.removeSchedule(id, function(err, schedule){
		if(err){
			throw err;
		}
		res.json(schedule);
	});
});

/*
app.put('/api/schedules/:id', function(req, res){
	var id = req.params.id;
	var schedule = req.body;
	Schedule.updateSchedule(id, schedule, {}, function(err, schedule){
		if(err){
			throw err;
		}
		res.json(schedule);
	});
});
*/
/*
app.get('/api/schedules/:_id', function(req, res){
	//var id = req.params.id;
	//var schedule = req.body;
	Schedule.findOne({id: req.params._id}, function(err,schedule){
		if (err) { return next(err);}
		schedule.quantity += 1;
		schedule.save(function(err) {
    	if (err) { return next(err); }}); 
		console.log(schedule);
		res.json(schedule);
	});
});
*/
// Assign

app.get('/api/assigns',function(req,res){
	Assign.getAssigns(function(err,assigns){
		if(err){
			throw err;
		}
		res.json(assigns);
	});
});

app.get('/api/assigns/:id',function(req,res){
	Assign.find({id: req.params.id}, function(err,assigns){
		if(err){
			throw err;}
		res.json(assigns);
	});
});

app.post('/api/assigns/:_id', function(req, res){
	var assign = req.body;
	var order
	
	Schedule.findOne({_id: req.params._id}, function(err,schedule){
		if (err) { return next(err);}
		schedule.quantity += 1;

		order = schedule.quantity;
		schedule.save(function(err) {
    	if (err) { return next(err); }}); 
		//console.log(schedule);
		//res.json(schedule);

		Assign.addAssign(assign, function(err, assign){
		if(err){
			throw err;
		}
		
		assign.order = order;
		assign.save(function(err) {
    	if (err) { return next(err); }});
		res.json(assign);
	});
	});
	
});

app.delete('/api/assigns/:id', function(req, res){
	var id = req.params.id;
	Assign.removeAssign(id, function(err, assigns){
		if(err){
			throw err;
		}
		res.json(assigns);
	});
});

//Rate
app.get('/api/rates',function(req,res){
	Rate.getRates(function(err,rates){
		if(err){
			throw err;
		}
		res.json(rates);
	});
});

app.get('/api/rates/:id',function(req,res){
	Rate.find({id: req.params.id}, function(err,rates){
		if(err){
			throw err;}
		res.json(rates);
	});
});

app.post('/api/rates', function(req, res){
	var rate = req.body;
	Rate.addRate(rate, function(err, rate){
		if(err){
			throw err;
		}
		res.json(rate);
	});
});

app.delete('/api/rates/:id', function(req, res){
	var id = req.params.id;
	Rate.removeRate(id, function(err, rates){
		if(err){
			throw err;
		}
		res.json(rates);
	});
});

app.listen(3003);
console.log('Running on port 3003...');
