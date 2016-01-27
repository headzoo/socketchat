'use strict';

var React      = require('react');
var Reflux     = require('reflux');
var formatters = require('../util/formatters');
var Linkify    = require('../utils/linkify');
var ReactEmoji = require('react-emoji');

var emojify_opts = {
    attributes: {
        width: "18px",
        height: "18px"
    }
};

var Messages = React.createClass({
    mixins: [ReactEmoji],
    
    getDefaultProps: function() {
        return {
            items: []
        }
    },

    render: function() {
        var message_items = [];
        var messages      = this.props.items;
        for (var i = 0; i < messages.length; i++) {
            var styles = {
                color: messages[i].color || "#FFF"
            };
            if (messages[i].type == "user") {
                message_items.push(
                    <li key={i} className="message-type-user">
                        <span className="timestamp">{formatters.date(messages[i].time)}</span>
                        <span className="nickname">{messages[i].user}:</span>
                        <span className="message" style={styles}>
                            <Linkify>
                                {this.emojify(messages[i].text, emojify_opts)}
                            </Linkify>
                        </span>
                    </li>
                );
            } else if (messages[i].type == "notice") {
                message_items.push(
                    <li key={i} className="message-type-notice">
                        <span className="timestamp">{formatters.date(messages[i].time)}</span>
                        <span className="message" style={styles}>
                            <Linkify>
                                {this.emojify(messages[i].text, emojify_opts)}
                            </Linkify>
                        </span>
                    </li>
                );
            }
        }

        return (
            <ul className="messages-list">
                {message_items}
            </ul>
        )
    }
});

module.exports = Messages;
