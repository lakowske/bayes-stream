/*
 * (C) 2015 Seth Lakowske
 */


var through  = require('through');
var through2 = require('through2');

function density(probabilities) {
    var sum = 0.0;
    for (var probablity in probabilities) {
        sum += probabilities[probablity];
    }
    var normalized = [];
    var position = 0.0;
    for (var probability in probabilities) {
        position = position + (probabilities[probability] / sum);
        var token = {
            name:probability,
            value:position
        };
        normalized.push(token)
    }

    var dieRoll = Math.random();
    for (var i = 0 ; i < normalized.length ; i++) {
        if ( dieRoll <= normalized[i].value ) {
            return normalized[i].name;
        }
    }

    return 'Error';
}

function bayesNode(name, probabilities) {
    return through(function(event) {
        if (typeof event === 'string') {
            event = JSON.parse(event);
        }
        var value = density(probabilities);
        event[name] = value;

        this.queue(JSON.stringify(event));
    }, function(end) {
        this.queue(null);
    });
}

function bayesNodeThrough2(name, probabilities) {
    return through2.obj(function(event, enc, callback) {
        var value = density(probabilities);
        event[name] = value;

        this.push(event);
        callback();
    });
}

module.exports.bayesNode = bayesNode;
module.exports.bayesNodeThrough2 = bayesNodeThrough2;
