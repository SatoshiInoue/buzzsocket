var express = require('express'),
	http = require('http'),
	io = require('socket.io');
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, res){
    res.send("It works!");
});
 
var server = http.createServer(app);

io = io.listen(server);

io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 10); 
});

var buzzStatus = false;
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat', systemMsg: true});
    
    socket.emit('pageview', { 'connections': Object.keys(io.connected).length});
    
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
    
    socket.on('register', function (data) {
        io.sockets.emit('status_update', {user: data.user, status: "online"});
    });
    
    socket.on('buzz', function (data) {
    	if (!buzzStatus) {
    		buzzStatus = true;
    		io.sockets.emit('buzz_update', {user: data.user, reset: false});
    	}
    });
    
    socket.on('reset', function (data) {
    	console.log('reset');
    	buzzStatus = false;
    	io.sockets.emit('buzz_update', {user: data.user, reset: true});
    });
    
    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });

});


server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});