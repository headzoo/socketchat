'use strict';

var React              = require('react');
var Reflux             = require('reflux');
var LinkedState        = require('react-addons-linked-state-mixin');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var ErrorStore         = require('../stores/error');
var validator          = require('validator');

var Mask = React.createClass({
    mixins: [LinkedState, Reflux.connect(ErrorStore, "error")],

    /**
     *
     * @returns {{nick: string, onJoin: Function}}
     */
    getDefaultProps: function() {
        return {
            nick:       "",
            onJoin:     function() {
            },
            onRegister: function() {
            }
        }
    },

    /**
     *
     * @returns {{username: string, password: string}}
     */
    getInitialState: function() {
        return {
            username:     "",
            password:     "12345",
            reg_username: "",
            reg_email:    "",
            reg_password: ""
        }
    },

    /**
     *
     */
    componentDidMount: function() {
        if (this.props.nick != "") {
            this.setState({username: this.props.nick});
        }
    },

    /**
     *
     * @returns {XML}
     */
    render: function() {
        var notice_auth = null;
        if (this.state.error.unauthorized) {
            notice_auth = (<div className="alert alert-danger" role="alert">{this.state.error.unauthorized}</div>);
        }
        var notice_registration = null;
        if (this.state.error.registration) {
            notice_registration = (
                <div className="alert alert-danger" role="alert">{this.state.error.registration}</div>);
        }

        return (
            <div className="mask">
                <div className="row">
                    <div className="col-lg-4 col-lg-offset-4 mask-nick-form">
                        <h3>Login</h3>
                        <CSSTransitionGroup transitionName="alert" transitionEnterTimeout={500}
                                            transitionLeaveTimeout={300}>
                            {notice_auth}
                        </CSSTransitionGroup>

                        <div className="form-group">
                            <label>Nickname</label>
                            <input type="text" className="form-control" valueLink={this.linkState('username')}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" valueLink={this.linkState('password')}/>
                        </div>
                        <button className="btn btn-default" onClick={this.handleJoin}>Join Chat</button>

                        <div className="or">or</div>
                        <h3>Register</h3>
                        <CSSTransitionGroup transitionName="alert" transitionEnterTimeout={500}
                                            transitionLeaveTimeout={300}>
                            {notice_registration}
                        </CSSTransitionGroup>

                        <div className="form-group">
                            <label>Nickname</label>
                            <input type="text" className="form-control" valueLink={this.linkState('reg_username')}/>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" valueLink={this.linkState('reg_email')}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" valueLink={this.linkState('reg_password')}/>
                        </div>
                        <button className="btn btn-default" onClick={this.handleRegister}>Register and Join Chat
                        </button>
                    </div>
                </div>
            </div>
        )
    },

    /**
     *
     */
    handleJoin: function() {
        this.props.onJoin(this.state.username, this.state.password);
    },

    /**
     *
     */
    handleRegister: function() {
        if (this.state.reg_username == "") {
            this.setState({
                error: {registration: "Username cannot be blank."}
            });
            return;
        }
        if (this.state.reg_email == "") {
            this.setState({
                error: {registration: "Email cannot be blank."}
            });
            return;
        }
        if (this.state.reg_password == "") {
            this.setState({
                error: {registration: "Password cannot be blank."}
            });
            return;
        }
        if (validator.matches(this.state.reg_username, /[^a-zA-Z0-9_]/)) {
            this.setState({
                error: {registration: "Username may only contain alphanumeric characters."}
            });
            return;
        }
        if (this.state.reg_username.length > 14) {
            this.setState({
                error: {registration: "Username must be under 14 characters."}
            });
            return;
        }
        if (!validator.isEmail(this.state.reg_email)) {
            this.setState({
                error: {registration: "Invalid email address."}
            });
            return;
        }

        this.props.onRegister(
            this.state.reg_username,
            this.state.reg_email,
            this.state.reg_password
        )
    }
});

module.exports = Mask;
