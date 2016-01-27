'use strict';

var Reflux      = require('reflux');
var ErrorActions = require('../actions/error');
var io          = require('socket.io-client');

module.exports = Reflux.createStore({
    listenables: [ErrorActions],
    errors: {
        unauthorized: null
    },

    getInitialState: function() {
        return this.errors;
    },

    onUnauthorized: function(err) {
        this.errors.unauthorized = err.message;
        this.trigger(this.errors);
    }
});