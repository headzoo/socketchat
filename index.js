var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var socket = require('socket.io');
var io = socket(http);

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var users    = [];
var messages = [
    createNoticeMessage("Welcome to the room! Obey the rules!"),
    createUserMessage("Sean", "How's everyone doing today?"),
    createUserMessage("Josh", "I'm doing alright."),
    createUserMessage("Alex", "Yep, me too.")
];
var registered = {
    "sean": "12345",
    "josh": "12345",
    "alex": "12345"
};

app.use(express.static("public"));
app.get("/", function(req, res){
    res.sendFile("index.html", { root: __dirname });
});

require("socketio-auth")(io, {
    authenticate: function (socket, data, callback) {
        var username = data.username.toLowerCase();
        if (registered[username] == undefined || registered[username] != data.password) {
            return callback(new Error("Invalid username or password."));
        }
        return callback(null, true);
    },
    
    postAuthenticate: function(socket, data) {
        socket.client.nick = data.username;
    }
});

io.on("connection", function(socket) {
    socket.on("room.join", function() {
        users.push(socket.client.nick);
        socket.emit("room.load", {
            users: users,
            messages: messages
        });
        socket.broadcast.emit("room.join", socket.client.nick);
    });
    
    socket.on("room.message", function(text) {
        var m = createUserMessage(socket.client.nick, text);
        messages.push(m);
        socket.emit("room.message", m);
        socket.broadcast.emit("room.message", m);
    });

    socket.on("disconnect", function() {
        users.remove(socket.client.nick);
        socket.broadcast.emit("room.leave", socket.client.nick);
    });
    
    setInterval(function() {
        socket.emit("room.users", users);
    }, 15000);
});

http.listen(5001, function(){
    console.log("listening on *:5001");
});

function createUserMessage(user, text) {
    return {
        time: new Date(),
        type: "user",
        user: user,
        text: text
    }
}

function createNoticeMessage(text) {
    return  {
        time: new Date(),
        type: "notice",
        text: text
    }
}