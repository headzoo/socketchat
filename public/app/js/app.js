var React    = require('react');
var ReactDOM = require('react-dom');
var App      = require('./components/app');

$(function() {
    var nick = getHashValue("name");
    ReactDOM.render(
        React.createElement(App, {nick: nick, host: "local.socketchat.com"}),
        document.getElementById("mount")
    );
});

function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
}