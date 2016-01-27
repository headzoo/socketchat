'use strict';

var React     = require('react');
var LinkifyIt = require('linkify-it');
var tlds      = require('tlds');

var linkify = new LinkifyIt();
linkify.tlds(tlds);

var Linkify = React.createClass({
    MATCH: 'LINKIFY_MATCH',
    parseCounter: 0,
    propTypes: {
        component: React.PropTypes.any,
        properties: React.PropTypes.object,
        urlRegex: React.PropTypes.object,
        emailRegex: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            component: 'a',
            properties: {}
        }
    },
    
    getMatches: function(string) {
        return linkify.match(string);
    },

    parseString: function(string) {
        var elements = [];
        if (string === '') {
            return elements;
        }

        var matches = this.getMatches(string);
        if (!matches) {
            return string;
        }
        
        var lastIndex = 0;
        var idx = 0;
        for (var match of matches) {
            // Push the preceding text if there is any
            if (match.index > lastIndex) {
                elements.push(string.substring(lastIndex, match.index));
            }
            
            // Shallow update values that specified the match
            var props = {href: match.url, key: `match${++idx}`};
            for (var key in this.props.properties) {
                if (this.props.properties.hasOwnProperty(key)) {
                    var val = this.props.properties[key];
                    if (val === Linkify.MATCH) {
                        val = match.url;
                    }
                    props[key] = val;
                }
            }
            
            if (match.text.endsWith(".jpg") || match.text.endsWith(".jpeg") || match.text.endsWith(".png") || match.text.endsWith(".gif")) {
                elements.push(
                    <a href={match.text} target="_blank">
                        <img src={match.text}/>
                    </a>
                );
            } else if (match.text.endsWith(".mp4") || match.text.endsWith(".webm")) {
                elements.push(
                    <a href={match.text} target="_blank">
                        <video src={match.text} controls={true}/>
                    </a>
                );
            } else {
                elements.push(
                    <a href={match.text} target="_blank">{match.text}</a>
                );
            }
            
            lastIndex = match.lastIndex;
        }

        if (lastIndex < string.length) {
            elements.push(string.substring(lastIndex));
        }

        return (elements.length === 1) ? elements[0] : elements;
    },

    parse: function(children) {
        var parsed = children;

        if (typeof children === 'string') {
            parsed = this.parseString(children);
        } else if (React.isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
            parsed = React.cloneElement(
                children,
                {key: `parse${++this.parseCounter}`},
                this.parse(children.props.children)
            );
        } else if (children instanceof Array) {
            parsed = children.map(child => {
                return this.parse(child);
            });
        }

        return parsed;
    },

    render: function() {
        this.parseCounter = 0;
        var parsedChildren = this.parse(this.props.children);

        return <span className="linkify">{parsedChildren}</span>;
    }
});

module.exports = Linkify;