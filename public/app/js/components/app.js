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
var InputColor         = require('react-input-color');

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
     * @returns {{text: string, color: string}}
     */
    getInitialState: function() {
        return {
            text: "",
            color: "#FFFFFF"
        }
    },

    /**
     * 
     */
    componentDidMount: function() {
        this.input_dom = ReactDOM.findDOMNode(this.refs.text);
        var text_color = localStorage.getItem("text_color");
        if (text_color) {
            this.setState({color: text_color});
        }
    },

    /**
     * 
     * @returns {XML}
     */
    render: function() {
        var mask = null;
        if (!this.state.chat.connected) {
            mask = (<Mask key="mask" nick={this.props.nick} onJoin={this.handleJoin} onRegister={this.handleRegister} />);
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
                                    ref="text"
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Enter Message"
                                    onKeyDown={this.handleInputKeyDown}
                                    valueLink={this.linkState('text')} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" onClick={this.handleSend}>SEND</button>
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-2 user-button-wrap">
                            <div className="input-group">
                                <InputColor
                                    value={this.state.color}
                                    onChange={this.handleColorChange} />
                            </div>
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

    handleRegister: function(username, email, password) {
        ChatActions.register(username, email, password);
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
     * @param c
     */
    handleColorChange: function(c) {
        this.setState({color: c});
        localStorage.setItem("text_color", c);
    },

    /**
     * 
     */
    handleSend: function() {
        if (this.state.input == "") {
            return;
        }
        ChatActions.send({
            text: this.state.text,
            color: this.state.color
        });
        this.setState({text: ""});
        this.input_dom.focus();
    }
});

module.exports = App;
