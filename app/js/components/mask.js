'use strict';

var React       = require('react');
var LinkedState = require('react-addons-linked-state-mixin');

function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key + '=([^&]*)'));
    return matches ? matches[1] : null;
}

var Mask = React.createClass({
    mixins: [LinkedState],

    getDefaultProps: function() {
        return {
            nick: "",
            onJoin: function() {}
        }
    },
    
    getInitialState: function() {
        return {
            input: "",
            password: "12345"
        }
    },

    componentDidMount: function() {
        if (this.props.nick != "") {
            this.setState({input: this.props.nick});
        }
    },

    render: function() {
        return (
            <div className="mask">
                <div className="row">
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="mask-nick-form">
                            <div className="form-group">
                                <label>Nickname</label>
                                <input type="text" className="form-control" valueLink={this.linkState('input')}/>
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

    handleJoin: function() {
        this.props.onJoin(this.state.input, this.state.password);
    }
});

module.exports = Mask;
