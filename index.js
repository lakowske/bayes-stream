/*
 * (C) 2015 Seth Lakowske
 */


var through = require('through');

/*
 * Return the probability of event occurring given some evidence (i.e. condition).
 *
 * @param {Object} condition to stream probability for.
 * e.g. { outcome : {cancer : 'true'}, conditional : {diagnosis : "true"} }
 * @param {Object} event with properties describing the event
 * e.g. {cancer : "true", diagnosis : "true"} or
 *      { url   : "/articles/github-push-event-deployment", system : "Linux" }
 * @return {Object} Return the conditional probablity of events.
 * e.g. P( { url : '/news' } | {system : 'linux', referal : '/about' } ) = 0.1   or
 *      P( { url : '/news' } | {system : 'linux'} )                      = 0.75
 */
function buildBayesStream(condition) {
    var outcomes = condition.outcome;
    var conditional = condition.conditional;
    var matched = 0;
    var other   = 0;
    var total   = 0;

    var stream = through(function write(event) {

        var result = {}
        total += 1;

        //check the event outcome matches the target outcome
        for (var outcomeName in outcomes) {
            if (outcomes.hasOwnProperty(outcomeName)) {
                result.outcome = outcomeName;
                result.target  = outcomes[outcomeName];
            }
        }
        result.actual         = event[result.outcome];
        result.matchOutcome   = result.target === result.actual;

        var constraint = true;
        for (var condition in conditional) {
            var criteria = conditional[condition]
            var value = event[condition]
            constraint = (criteria === value)
        }

        if (constraint && result.matchOutcome) {
            matched += 1;
        } else if (constraint && !result.matchOutcome) {
            other   += 1;
        }

        result.matched                = matched;
        result.other                  = other;
        result.total                  = total;
        result.conditionalProbability = (matched / (matched + other));
        result.msg = 'P( ' + JSON.stringify(outcomes) + ' | ' + JSON.stringify(conditional) + ' ) = ' + result.conditionalProbability;

        if (result === {}) {
            this.queue(event);
            return;
        } else {
            this.queue(result);
            return;
        }


    }, function(end) {

        this.queue(null);
    });

    return stream;
}

module.exports = buildBayesStream;
