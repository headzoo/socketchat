'use strict';

var Reflux = require('reflux');

module.exports = Reflux.createActions([
    'ready',
    'send',
    'connect',
    'authenticate',
    'socketAuthenticated',
    'socketUnauthorized',
    'socketRoomJoin',
    'socketRoomLeave',
    'socketRoomLoad',
    'socketRoomMessage',
    'socketRoomMessages',
    'socketRoomUsers'
]);