'use strict';

var DateFormat = require('dateformat');

function annotate(number, maxPlaces, forcePlaces, abbr) {
    var rounded = 0;
    switch(abbr) {
        case 't':
            rounded = number / 1e12;
            break;
        case 'b':
            rounded = number / 1e9;
            break;
        case 'm':
            rounded = number / 1e6;
            break;
        case 'k':
            rounded = number / 1e3;
            break;
        case '':
            rounded = number;
            break;
    }
    if(maxPlaces !== false) {
        var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$');
        if(test.test(('' + rounded))) {
            rounded = rounded.toFixed(maxPlaces)
        }
    }
    if(forcePlaces !== false) {
        rounded = Number(rounded).toFixed(forcePlaces)
    }

    return rounded + abbr
}

module.exports = {
    date: function(cell) {
        return DateFormat(cell, "h:MM TT");
    },
    timeAgo: function(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + "y";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + "m";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + "d";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + "h";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + "m";
        }
        return Math.floor(seconds) + "s";
    },
    likes: function(number, maxPlaces, forcePlaces) {
        number      = Number(number);
        forcePlaces = forcePlaces || 1;
        maxPlaces   = maxPlaces || 1;

        var abbr;
        if(number >= 1e12) {
            abbr = 't';
        } else if(number >= 1e9) {
            abbr = 'b';
        } else if(number >= 1e6) {
            abbr = 'm';
        } else if(number >= 1e3) {
            abbr = 'k';
        } else {
            abbr = '';
            forcePlaces = 0
        }

        return annotate(number, maxPlaces, forcePlaces, abbr)
    },
    bool: function(cell) {
        return cell == 0 ? "No" : "Yes";
    },
    ucwords: function(str) {
        return (str + '')
            .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
                return $1.toUpperCase();
            });
    }
};