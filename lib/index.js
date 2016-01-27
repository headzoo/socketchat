var app     = require('express')();
var express = require('express');
var http    = require('http').Server(app);
var socket  = require('socket.io');
var mysql   = require("mysql");
var bcrypt  = require('bcrypt');
var io      = socket(http);

var users    = [];
var messages = [];

var db = mysql.createConnection({
    host:     "localhost",
    user:     "chatter",
    password: "lFOWuJXAUFS7z86yBnLFAK",
    database: "socketchat"
});
db.connect(function(err) {
    if (err) {
        console.log("Error connecting to Db");
        return;
    }

    db.query("SELECT * FROM `message` ORDER BY `id` DESC LIMIT 50",function(err, rows){
        if(err) {
            console.log(err);
            return;
        }
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            messages.unshift(
                createUserMessage(row.username, row.text, row.color, row.created)
            )
        }
    });
});



app.use(express.static("public"));
app.get("/", function(req, res) {
    res.sendFile("index.html", {root: __dirname});
});

require("socketio-auth")(io, {
    authenticate: function(socket, data, callback) {
        db.query("SELECT * FROM `user` WHERE ?", {username: data.username}, function(err, res) {
            if (err) {
                console.log(err);
                return;
            }
            if (res.length == 0) {
                return callback(new Error("Invalid username or password."));
            }
            bcrypt.compare(data.password, res[0].password, function(err, res) {
                if (err) console.log(err);
                if (!res) {
                    callback(new Error("Invalid username or password."));
                }
                callback(null, true);
            });
        });
    },

    postAuthenticate: function(socket, data) {
        socket.client.nick = data.username;
    }
});

io.on("connection", function(socket) {
    
    socket.on("register", function(info) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(info.password, salt, function(err, hash) {
                var p = info.password;
                info.password = hash;
                db.query('INSERT INTO `user` SET ?', info, function(err, res){
                    if(err) {
                        socket.emit("registered", {
                            error: "Username or email already in use."
                        });
                        return;
                    }
                    
                    info.password = p;
                    socket.emit("registered", info);
                });
            });
        });
    });
    
    socket.on("room.join", function() {
        users.push(socket.client.nick);
        socket.emit("room.load", {
            users:    users,
            messages: messages
        });
        socket.broadcast.emit("room.join", socket.client.nick);
    });

    socket.on("room.message", function(message) {
        var m = createUserMessage(socket.client.nick, message.text, message.color);
        messages.push(m);
        socket.emit("room.message", m);
        socket.broadcast.emit("room.message", m);
        
        var row = {
            username: socket.client.nick,
            text: message.text,
            color: message.color,
            created: m.time
        };
        db.query("INSERT INTO `message` SET ?", row, function(err) {
            if(err) {
                console.log(err)
            }
        });
    });

    socket.on("disconnect", function() {
        users = users.filter(function(u) {
            return u != socket.client.nick;
        });
        socket.broadcast.emit("room.leave", socket.client.nick);
    });

    setInterval(function() {
        socket.emit("room.users", users);
    }, 15000);
});

http.listen(5001, function() {
    console.log("listening on *:5001");
});

function createUserMessage(user, text, color, time) {
    color = color || "#FFFFFF";
    time = time || new Date();
    return {
        time: time,
        type: "user",
        user: user,
        text: text,
        color: color
    }
}

function createNoticeMessage(text, color, time) {
    color = color || "#FFFFFF";
    time = time || new Date();
    return {
        time: time,
        type: "notice",
        text: text,
        color: color
    }
}