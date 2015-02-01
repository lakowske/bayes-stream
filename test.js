/*
 * (C) 2015 Seth Lakowske
 */

var test       = require('tape');
var bayesCalc  = require('./');


test('keeps track of counts', function(t) {

    var bayes = bayesCalc({
        outcome     : {cancer : 'true'},
        conditional : {diagnosis : "true"}
    });

    bayes.write({cancer : 'true', diagnosis : 'true'})
    bayes.write({cancer : 'true', diagnosis : 'true'})
    bayes.write({cancer : 'true', diagnosis : 'true'})

    bayes.write({cancer : 'true', diagnosis : 'false'})


    bayes.write({cancer : 'false', diagnosis : 'false'})
    bayes.write({cancer : 'false', diagnosis : 'false'})
    bayes.write({cancer : 'false', diagnosis : 'false'})

    bayes.write({cancer : 'false', diagnosis : 'true'})

    //t.equal(bayesCalculator.events(), 8, 'should be 8 events');

    //t.equal(bayesCalculator.probability({cancer:'true'}), 0.5, 'should be 0.5');


    t.end();
})

