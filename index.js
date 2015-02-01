/*
 * (C) 2015 Seth Lakowske
 */


var through = require('through');

/*
 * Return the probability of event occurring given some evidence (i.e. condition).
 *
 * @param {Object} condition to stream probability for.
 * @param {Object} event defined by properties
 * (e.g. {cancer : "true", diagnosis : "true"} or
 *       { url   : "/articles/github-push-event-deployment", system : "Linux" }
 * @return {Object} the probabilty of the event.
 */

/*
 * Return the conditional P( { url : "/news" } | {system : "Linux", referal : "/about" } )
 */
function buildBayesStream(condition) {

    // p ( '/about' | 'linux' ) = { url : '/about', system : 'Linux', conditional : 'system', outcome : 'url' }
    conditionals = {}

    var stream = through(function write(event) {

        var result = {}
        for (var outcome in condition.outcome) {
            if (event[outcome]) {
                result[outcome] = event[outcome];
            }
        }

        if (result === {}) {
            this.queue(event);
            return;
        }
/*
        for (var outcome in result)  {
            
            
            event[outcome];
        event[condition.outcome]
        for (var property in event) {
            event[
        }
        var conditional = event[condition.conditional];
        var outcome     = event[condition.outcome];

        var criteria    = condition[condition.conditional];

        var applicable  = (criteria === conditional);


        if (applicable && outcome) {
            var occurrences = conditionals[outcome];
            if (!occurrences) conditionals[outcome] = 0;

            occurrences += 1;

            conditionals[outcome] = occurrences;
            this.queue({msg: 'P( ' + outcome + ' | ' + conditional + ' )',
                        outcome : outcome,
                        condition : conditional})

        } else {
            this.queue(event);
        }
*/

    }, function(end) {

        this.queue(null);
    });

    return stream;
}

module.exports = buildBayesStream;
