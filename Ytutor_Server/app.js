var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.json());

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");

server.listen(process.env.PORT || 3005);
console.log('Running on port 3005...');

Rate = require('./models/rateform.js');
Tutor = require('./models/tutor.js');
User = require('./models/user.js');
Chat = require('./models/chat.js');
Control = require('./models/control.js')
Room = require('./models/room.js')

// Connect to Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ytutor_server');
var db = mongoose.connection;

console.log('connect database...');
// gate
app.get("/", function(req, res){
	res.send('Hello');	
});

// User
// all users
app.get('/api/users',function(req,res){
	User.getUsers(function(err,users){
		if(err) {
			throw err;
		} 
		else res.json(users);
	});
});

//sign in
app.get('/api/users/:username&:password', function(req, res){
	User.find({username: req.params.username,password: req.params.password}, function(err, user) {
		if(err) {
			throw err;
		} else {
			res.json(user);
		}
	})
});

//sign up
app.post('/api/users/:_id', function(req, res){
	/*
	var user = req.body;
	User.addUser(user, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
	*/

	var user = req.body;
	var id
	
	Control.findOne({_id: req.params._id}, function(err,control){
		if (err) { return next(err);}
		control.num += 1;

		id = control.num;
		
		control.save(function(err) {
    	if (err) { return next(err); }}); 
		//console.log(schedule);
		//res.json(schedule);

		User.addUser(user, function(err, user){
		if(err){
			throw err;
		}
		
		user.id = id;
		user.save(function(err) {
    	if (err) { return next(err); }});
		res.json(user);
	});
	});

});

//update info
app.put('/api/users/:id', function(req, res){
	var id = req.params.id;
	var user = req.body;
	User.updateUser(id, user, {}, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// delete user
app.delete('/api/users/:id', function(req, res){
	var id = req.params.id;
	User.removeUser(id, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// Tutor
//get list of tutors
app.get('/api/users/:type',function(req,res){
	User.find({type: req.params.type}, function(err, users){
		if(err) {
			throw err;
		} else res.json(users);
	});
});

//get list of tutors profile
app.get('/api/tutors',function(req,res){
	Tutor.getTutors(function(err,tutors){
		if(err){
			throw err;
		}
		res.json(tutors);
	});
});

//get tutor profile(summary, exp, cer)
app.get('/api/tutors/:id',function(req,res){
	Tutor.find({id: req.params.id}, function(err, tutor){
		if(err) {
			throw err;
		} else res.json(tutor);
	});
});

//create tutor info
app.post('/api/tutors', function(req, res){
	var tutor = req.body;
	Tutor.addTutor(tutor, function(err, tutor){
		if(err){
			throw err;
		}
		res.json(tutor);
	});
});

//update tutor info
app.put('/api/tutors/:id', function(req, res){
	var id = req.params.id;
	var tutor = req.body;
	Tutor.updateTutor(id, tutor, {}, function(err, tutor){
		if(err){
			throw err;
		}
		res.json(tutor);
	});
});

//delete tutor
app.delete('/api/tutors/:id', function(req, res){
	var id = req.params.id;
	Tutor.removeTutor(id, function(err, tutor){
		if(err){
			throw err;
		}
		res.json(tutor);
	});
});


// Control
// get control number (ID)
app.get('/api/control',function(req,res){
	Control.getControl(function(err,control){
		if(err){
			throw err;
		}
		res.json(control);
	});
});

// create control
app.post('/api/control', function(req, res){
	var control = req.body;
	Control.addControl(control, function(err, control){
		if(err){
			throw err;
		}
		res.json(control);
	});
});

// delete 
app.delete('/api/control/:id', function(req, res){
	var id = req.params.id;
	Control.removeControl(id, function(err, control){
		if(err){
			throw err;
		}
		res.json(control);
	});
});

//Rate
// get rate of a tutor
app.get('/api/rates/:id',function(req,res){
	Rate.find({id: req.params.id}, function(err, rates){
		if(err) {
			throw err;
		} else res.json(rates);
	});
});

//create a rate
app.post('/api/rates', function(req, res){
	var rate = req.body;
	Rate.addRate(rate, function(err, rate){
		if(err){
			throw err;
		}
		res.json(rate);
	});
});

//delete a rate
app.delete('/api/rates/:id', function(req, res){
	var id = req.params.id;
	Rate.removeRate(id, function(err, rates){
		if(err){
			throw err;
		}
		res.json(rates);
	});
});


//Chat
//get chats
app.get('/api/chats/:room',function(req,res){
	Chat.find({room: req.params.room}, function(err, chats){
		if(err) {
			throw err;
		} else res.json(chats);
	});
});

//delete chat
app.delete('/api/chats/:room', function(req, res){
	var room = req.params.room;
	Chat.removeChat(room, function(err, chat){
		if(err){
			throw err;
		}
		res.json(chat);
	});
});

io.sockets.on('connection', function (socket) {
	
	console.log("someone connect");	
	
	socket.on('create', function(room){
		/*
		if (socket.lastRoom) {
        	socket.leave(socket.lastRoom);
        	socket.lastRoom = null;
    	}
    	socket.join(room);
    	socket.lastRoom = room;
		*/
		socket.join(room)
		console.log("join room:" + room);	

		// send chat
	socket.on('sendchat', function (data, id1) {

	// add a chat to db
	
	var chat = {room: room, sender: id1, text: data};
	Chat.addChat(chat,function(err, chat){
		if(err){
			throw err;
		}
		//res.json(chat);
	});

	// emit toi tat ca moi nguoi
	io.sockets.in(room).emit('server_sendchat', {msg: id1 + ":" + data });
	
	console.log(id1 + ":" + data);
	});

});
	socket.on('delete', function(room){
		socket.leave(room);
		console.log("leave room:" + room);
	});
});

//Room
//get rooms of a tutor or learner
app.get('/api/rooms/:type&:id',function(req,res){
	if(req.params.type == 1){
		Room.find({tutor_id: req.params.id}, function(err, rooms){
			if(err) {
				throw err;
			} else res.json(rooms);
		});
	}else{
		Room.find({learner_id: req.params.id}, function(err, rooms){
			if(err) {
				throw err;
			} else res.json(rooms);
		});
	}
});

//check existed room 
app.get('/api/rooms/:room',function(req,res){
	Room.find({room: req.params.room}, function(err, room){
		if(err) {
			throw err;
		} else res.json(room);
	});
});

//create a room
app.post('/api/rooms', function(req, res){
	var room = req.body;
	Room.addRoom(room, function(err, room){
		if(err){
			throw err;
		}
		res.json(room);
	});
});

// all rooms
app.get('/api/rooms',function(req,res){
	Room.getRooms(function(err,rooms){
		if(err) {
			throw err;
		} 
		else res.json(rooms);
	});
});

//delete room
app.delete('/api/rooms/:room', function(req, res){
	var room = req.params.room;
	Room.removeRoom(room, function(err, room){
		if(err){
			throw err;
		}
		res.json(room);
	});
});
