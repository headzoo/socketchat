'use strict';

var React       = require('react');
var Reflux      = require('reflux');
var LinkedState = require('react-addons-linked-state-mixin');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var ErrorStore   = require('../stores/error');

var Mask = React.createClass({
    mixins: [LinkedState, Reflux.connect(ErrorStore, "error")],

    /**
     * 
     * @returns {{nick: string, onJoin: Function}}
     */
    getDefaultProps: function() {
        return {
            nick: "",
            onJoin: function() {}
        }
    },

    /**
     * 
     * @returns {{username: string, password: string}}
     */
    getInitialState: function() {
        return {
            username: "",
            password: "12345"
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
        var notice = null;
        if (this.state.error.unauthorized) {
            notice = (<div className="alert alert-danger" role="alert">{this.state.error.unauthorized}</div>);
        }
        
        return (
            <div className="mask">
                <div className="row">
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="mask-nick-form">
                            <CSSTransitionGroup transitionName="alert" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                                {notice}
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
                        </div>
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
    }
});

module.exports = Mask;
