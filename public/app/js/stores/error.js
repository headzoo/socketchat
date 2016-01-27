'use strict';

var Reflux      = require('reflux');
var ErrorActions = require('../actions/error');
var io          = require('socket.io-client');

module.exports = Reflux.createStore({
    listenables: [ErrorActions],
    errors: {
        unauthorized: null,
        registration: null
    },

    getInitialState: function() {
        return this.errors;
    },

    onUnauthorized: function(err) {
        this.errors.unauthorized = err.message;
        this.trigger(this.errors);
    },
    
    onRegistration: function(err) {
        this.errors.registration = err;
        this.trigger(this.errors);
    }
});