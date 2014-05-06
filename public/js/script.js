//var messages = [];
var socket = io.connect();
var numOfMsg = 0;
var style = "";

var thisUser;

socket.on('connect', function () {
	console.log('Socket connected');
});

socket.on('message', function (data) {
	console.log(data.message);
    if(data.message) {
        //messages.push(data);
    	numOfMsg++;
    	if (numOfMsg%2 != 0)
    		style = "bgDark";
    	else
    		style = "bgLight";
    	
        if (data.systemMsg) {
        	$("#messages").append("<li class=\"" + style + "\">" + data.message + "</li>");
        } else {
        	$("#messages").append("<li class=\"" + style + "\">" + data.username + " said: " + data.message + "</li>");
        }
    } else {
        console.log("Problem occured:", data);
	}
});

socket.on('status_update', function (data) {
	console.log(data);
    if(data.user == "p1") {
    	$("#p1status").html("Online");
    } else if (data.user == "p2") {
    	$("#p2status").html("Online");
    } else if (data.user == "p3") {
    	$("#p3status").html("Online");
    }
});

socket.on('buzz_update', function (data) {
	console.log(data);
	if (data.reset == true) {
		$("#p1buzz").html("X");
		$("#p2buzz").html("X");
		$("#p3buzz").html("X");
	} else {
	    if(data.user == "p1") {
	    	$("#p1buzz").html("O");
	    } else if (data.user == "p2") {
	    	$("#p2buzz").html("O");
	    } else if (data.user == "p3") {
	    	$("#p3buzz").html("O");
	    }
    }
});
 
socket.on('pageview', function (data) {
    $('#connections').html(data.connections);
});

$("#send").click(function() {
    if($("#name").val() == "") {
        alert("Please type your name!");
    } else if ($("#new-message").val() == "") {
		alert("Please type message!");
	}else {
        //var text = field.value;
        socket.emit('send', { message: $("#new-message").val(), username: $("#name").val()});
    }
});

$("#registerBtn").click(function() {
	thisUser = $("#registeras option:selected").val();
	console.log(thisUser);
    if(thisUser != "ref") {
        socket.emit('register', { user: thisUser});
    }
});

$("#buzzBtn").click(function() {
	socket.emit('buzz', { user: thisUser});
    
});

$("#resetBtn").click(function() {
	
	socket.emit('reset', {user: thisUser});
    
});

window.onhashchange = function () {
	console.log("onhashchange");
  socket.send(window.location.href);
}