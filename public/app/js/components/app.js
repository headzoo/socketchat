'use strict';

var React              = require('react');
var ReactDOM           = require('react-dom');
var Reflux             = require('reflux');
var Update             = require('react-addons-update');
var LinkedState        = require('react-addons-linked-state-mixin');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var Users              = require('./users');
var Messages           = require('./messages');
var ChatStore          = require('../stores/chat');
var ChatActions        = require('../actions/chat');
var Mask               = require('./mask');

var App = React.createClass({
    mixins: [
        LinkedState,
        Reflux.connect(ChatStore, "chat")
    ],
    input_dom: null,

    /**
     * 
     * @returns {{nick: string, host: string}}
     */
    getDefaultProps: function() {
        return {
            nick: "",
            host: ""
        }
    },

    /**
     * 
     * @returns {{input: string}}
     */
    getInitialState: function() {
        return {
            input: ""
        }
    },
    
    componentDidMount: function() {
        this.input_dom = ReactDOM.findDOMNode(this.refs.input);
    },

    /**
     * 
     * @returns {XML}
     */
    render: function() {
        var mask = null;
        if (!this.state.chat.connected) {
            mask = (<Mask key="mask" nick={this.props.nick} onJoin={this.handleJoin} />);
        }

        return (
            <div className="wrap">
                <div className="container container-top">
                    <div className="row">
                        <div className="col-lg-10 col-tall messages-list-wrap">
                            <Messages items={this.state.chat.messages}/>
                        </div>
                        <div className="col-lg-2 col-tall users-list-wrap">
                            <Users items={this.state.chat.users}/>
                        </div>
                    </div>
                </div>
                <div className="container container-bottom">
                    <footer className="row">
                        <div className="col-lg-10 user-input-wrap">
                            <div className="input-group">
                                <input
                                    ref="input"
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Message"
                                    onKeyDown={this.handleInputKeyDown}
                                    valueLink={this.linkState('input')} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" onClick={this.handleSend}>SEND</button>
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-2 user-button-wrap">
                            
                        </div>
                    </footer>
                </div>
                <CSSTransitionGroup transitionName="mask" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    {mask}
                </CSSTransitionGroup>
            </div>
        )
    },

    /**
     * 
     * @param nick
     * @param pass
     */
    handleJoin: function(nick, pass) {
        ChatActions.ready(this.props.host, nick, pass);
        this.input_dom.focus();
    },

    /**
     * 
     * @param e
     */
    handleInputKeyDown: function(e) {
        if (e.which == 13) {
            this.handleSend();
        }
    },

    /**
     * 
     */
    handleSend: function() {
        if (this.state.input == "") {
            return;
        }
        ChatActions.send(this.state.input);
        this.setState({input: ""});
        this.input_dom.focus();
    }
});

module.exports = App;
