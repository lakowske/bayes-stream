/*
 * (C) 2015 Seth Lakowske
 */

var test       = require('tape');
var through    = require('through');
var bayesCalc  = require('./');

test('predicts cancer likelihood', function(t) {

    var bayes = bayesCalc({
        outcome     : {cancer : 'true'},
        conditional : {diagnosis : "true"}
    });

    output = [];

    var capture = through(function(data) {
        output.push(data);
        this.queue(data);
    }, function(end) {
        t.equal(output[output.length-1].conditionalProbability, 0.75, '3/4 probability')
        this.queue(null);
    })

    bayes.pipe(capture);

    bayes.write({cancer : 'true', diagnosis : 'true'})
    bayes.write({cancer : 'true', diagnosis : 'true'})
    bayes.write({cancer : 'true', diagnosis : 'true'})

    bayes.write({cancer : 'true', diagnosis : 'false'})


    bayes.write({cancer : 'false', diagnosis : 'false'})
    bayes.write({cancer : 'false', diagnosis : 'false'})
    bayes.write({cancer : 'false', diagnosis : 'false'})

    bayes.write({cancer : 'false', diagnosis : 'true'})

    bayes.end();

    t.end();
})
