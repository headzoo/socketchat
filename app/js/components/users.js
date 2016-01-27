'use strict';

var React  = require('react');
var Reflux = require('reflux');

var Users = React.createClass({
    
    getDefaultProps: function() {
        return {
            items: []
        }
    },
    
    render: function() {
        var user_items = [];
        var users = this.props.items;
        for(var i = 0; i < users.length; i++) {
            user_items.push(<li key={i}>{users[i]}</li>);
        }
        
        return (
            <ul className="users-list">
                {user_items}
            </ul>
        )
    }
});

module.exports = Users;
