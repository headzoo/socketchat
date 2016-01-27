'use strict';

var Reflux       = require('reflux');
var ChatActions  = require('../actions/chat');
var ErrorActions = require('../actions/error');
var io           = require('socket.io-client');

module.exports = Reflux.createStore({
    listenables: [ChatActions],
    socket:      null,
    server:      null,
    chat:        {
        connected: false,
        nick:      "",
        pass:      "",
        users:     [],
        messages:  []
    },

    getInitialState: function() {
        return this.chat;
    },

    onReady: function(server, nick, pass) {
        this.server = server;
        this.chat.nick = nick;
        this.chat.pass = pass;
        this.trigger(this.chat);
        ChatActions.connect();
    },

    onSend: function(message) {
        this.socket.emit("room.message", message);
    },

    onAuthenticate: function() {
        this.socket.emit("authentication", {
            username: this.chat.nick,
            password: this.chat.pass
        });
    },
    
    onRegister: function(username, email, password) {
        this.socket = io(this.server);
        this.socket.on("connect", function() {
            this.socket.on("registered", ChatActions.registered);
            this.socket.emit("register", {
                username: username,
                email: email,
                password: password
            });
        }.bind(this));
    },
    
    onRegistered: function(info) {
        if (info.error != undefined) {
            ErrorActions.registration(info.error);
        } else {
            ChatActions.ready("local.socketchat.com", info.username, info.password);
        }
    },

    onConnect: function() {
        this.socket = io(this.server);
        this.socket.on("connect", function() {
            this.socket.on("authenticated", ChatActions.socketAuthenticated);
            this.socket.on("unauthorized", ChatActions.socketUnauthorized);
            this.socket.on("room.join", ChatActions.socketRoomJoin);
            this.socket.on("room.leave", ChatActions.socketRoomLeave);
            this.socket.on("room.load", ChatActions.socketRoomLoad);
            this.socket.on("room.messages", ChatActions.socketRoomMessages);
            this.socket.on("room.users", ChatActions.socketRoomUsers);
            this.socket.on("room.message", ChatActions.socketRoomMessage);

            ChatActions.authenticate();
        }.bind(this));
    },

    onSocketAuthenticated: function() {
        this.socket.emit("room.join");
        this.chat.connected = true;
        this.trigger(this.chat);
    },

    onSocketUnauthorized: function(err) {
        ErrorActions.unauthorized(err);
    },

    onSocketRoomLoad: function(room) {
        this.chat.users    = room.users;
        this.chat.messages = room.messages;
        this.trigger(this.chat);
    },

    onSocketRoomUsers: function(users) {
        this.chat.users = users;
        this.trigger(this.chat);
    },

    onSocketRoomJoin: function(user) {
        this.chat.users = this.chat.users.filter(function(u) {
            return u != user;
        });
        this.chat.users.push(user);
        this.trigger(this.chat);
    },

    onSocketRoomLeave: function(user) {
        this.chat.users = this.chat.users.filter(function(u) {
            return u !== user;
        });
        this.trigger(this.chat);
    },

    onSocketRoomMessages: function(messages) {
        this.chat.messages = messages;
        this.trigger(this.chat);
    },

    socketRoomMessage: function(message) {
        this.chat.messages.push(message);
        this.trigger(this.chat);
    }
});
