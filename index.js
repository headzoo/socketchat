var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
var messages = [];
var registered = {
    "sean": "12345",
    "josh": "12345",
    "alex": "12345"
};

app.use(express.static('public'));
app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname });
});

require('socketio-auth')(io, {
    authenticate: function (socket, data, callback) {
        var username = data.username.toLowerCase();
        if (registered[username] == undefined || registered[username] != data.password) {
            return callback(new Error("User not found"));
        }
        return callback(null, true);
    },
    
    postAuthenticate: function(socket, data) {
        socket.client.nick = data.username;
    }
});

io.on('connection', function(socket) {
    socket.on('room join', function() {
        console.log(socket.client.nick + " joined room");
        
        users.push(socket.client.nick);
        socket.emit('room load', {
            users: users,
            messages: messages
        });
        socket.emit('chat message', {
            time: new Date(),
            type: "notice",
            text: "Welcome to the room! Obey the rules!"
        });
        socket.broadcast.emit('room join', socket.client.nick);
    });
    
    socket.on('chat message', function(text) {
        var m = {
            time: new Date(),
            type: "user",
            user: socket.client.nick,
            text: text
        };
        messages.push(m);
        socket.emit('chat message', m);
        socket.broadcast.emit('chat message', m);
    });

    socket.on('disconnect', function() {
        users.remove(socket.client.nick);
        socket.broadcast.emit('room leave', socket.client.nick);
    });
    
    setInterval(function() {
        socket.emit('room users', users);
    }, 15000);
});

http.listen(5001, function(){
    console.log('listening on *:5001');
});