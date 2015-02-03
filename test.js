/*
 * (C) 2015 Seth Lakowske
 */

var test       = require('tape');
var through    = require('through');
var through2   = require('through2');
var bayesCalc  = require('./');
var bayesNode  = require('./bayes-node').bayesNode;
var bayesNode2  = require('./bayes-node').bayesNodeThrough2;

test('predicts cancer likelihood', function(t) {

    var bayes = bayesCalc({
        outcome     : {cancer : 'true'},
        conditional : {diagnosis : "true"}
    });

    output = [];

    var capture = through(function(data) {
        output.push(data);
        console.log(data);
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

test('predicts link clicks', function(t) {

    //what is the conditional probability of visiting '/about', given 
    //the system is 'linux' and referer is '/news'
    var bayes1 = bayesCalc({
        outcome     : {url : '/news'},
        conditional : {system : "linux"}
    });

    var bayes2 = bayesCalc({
        outcome     : {url : '/about'},
        conditional : {system : "macosx"}
    });

    output = [];

    var capture = through(function(data) {
        output.push(data);
        this.queue(data);
    }, function(end) {
        t.equal(output[output.length-1].conditionalProbability, (2/3), '2/3 probability')
        this.queue(null);
    })

    bayes1.pipe(capture);
    bayes2.pipe(capture);
    var bayes = through();
    bayes.pipe(bayes1);
    bayes.pipe(bayes2);

    bayes.write({url : '/news', system : 'linux'})
    bayes.write({url : '/news', system : 'linux'})
    bayes.write({url : '/news', system : 'linux'})
    bayes.write({url : '/news', system : 'macosx'})

    bayes.write({url : '/about', system : 'windows'})
    bayes.write({url : '/about', system : 'macosx'})
    bayes.write({url : '/about', system : 'macosx'})
    bayes.write({url : '/about', system : 'linux', referer : '/news'})

    bayes.end();

    t.end();

})

test('bayes net inference through', function(t) {
    //   possible values
    var page    = bayesNode('url', {'/about' : 1/3, '/news' : 1/3, '/subscribe' : 1/3})
    var browser = bayesNode('browser', {'firefox' : 1/4, 'chrome' : 1/4, 'ie' : 1/4, 'other' : 1/4})
    var system  = bayesNode('system', {'linux' : 1/8, 'macosx' : 3/8, 'windows' : 1/2})


    page.pipe(browser).pipe(system)
    var events = 10000;
    var start = new Date().getTime();

    for (var i = 0 ; i < events ; i++) {
        page.write({});
    }
    page.end();

    var end = new Date().getTime();
    var elapsed = end - start;
    console.log('elapsed time ' + elapsed + 'ms generating ' + events + ' events. ' + (events / elapsed) + ' events / ms' );
    t.end();
})

test('bayes net inference through2 object mode', function(t) {
    //   possible values
    var page    = bayesNode2('url', {'/about' : 1/3, '/news' : 1/3, '/subscribe' : 1/3})
    var browser = bayesNode2('browser', {'firefox' : 1/4, 'chrome' : 1/4, 'ie' : 1/4, 'other' : 1/4})
    var system  = bayesNode2('system', {'linux' : 1/8, 'macosx' : 3/8, 'windows' : 1/2})


    page.pipe(browser).pipe(system);
    var events = 10000;
    var start = new Date().getTime();

    for (var i = 0 ; i < events ; i++) {
        page.write({});
    }
    page.end();

    var end = new Date().getTime();
    var elapsed = end - start;
    console.log('elapsed time ' + elapsed + 'ms generating ' + events + ' events. ' + (events / elapsed) + ' events / ms' );


    t.end();

})

test('writes to bayes-calculator', function(t) {
    //   possible values
    var page    = bayesNode2('url', {'/about' : 1/2, '/news' : 1/4, '/subscribe' : 1/4})
    var browser = bayesNode2('browser', {'firefox' : 1/4, 'chrome' : 1/4, 'ie' : 1/4, 'other' : 1/4})
    var system  = bayesNode2('system', {'linux' : 1/8, 'macosx' : 3/8, 'windows' : 1/2})

    var stringify = through(function(data) {
        var stringy = JSON.stringify(data);
        this.queue(stringy + '\n');
    })

    var bayes2 = bayesCalc({
        outcome     : {url : '/about'},
        conditional : {system : "macosx"}
    });

    output = [];

    var capture = through(function(data) {
        output.push(data);
        this.queue(data);
    }, function(end) {
        var p = output[output.length-1].conditionalProbability;
        t.ok(Math.abs(p-(1/2)) < 0.05, '0.5 probability, ' + p + ' actual')
        this.queue(null);
    })

    page.pipe(browser).pipe(system).pipe(bayes2).pipe(capture);
    var events = 10000;
    var start = new Date().getTime();

    for (var i = 0 ; i < events ; i++) {
        page.write({});
    }
    page.end();

    var end = new Date().getTime();
    var elapsed = end - start;
    console.log('elapsed time ' + elapsed + 'ms generating ' + events + ' events. ' + (events / elapsed) + ' events / ms' );

    t.end();

})

test('writes to level db', function(t) {

    var level = require('level');
    var db    = level('./test.db');

    dbstream = db.createWriteStream();
    //   possible values
    var page    = bayesNode2('url', {'/about' : 1/2, '/news' : 1/4, '/subscribe' : 1/4})
    var browser = bayesNode2('browser', {'firefox' : 1/4, 'chrome' : 1/4, 'ie' : 1/4, 'other' : 1/4})
    var system  = bayesNode2('system', {'linux' : 1/8, 'macosx' : 3/8, 'windows' : 1/2})

    dbread = db.createReadStream();
    dbread.on('close', function() {
        t.end();
    })


    var id = 0;
    var stringify = through(function(data) {
        var content = JSON.stringify(data);
        var dbObject = {
            key : id,
            value : content
        }
        id += 1;
        this.queue(dbObject);
    })

    page.pipe(browser).pipe(system).pipe(stringify).pipe(dbstream).pipe(process.stdout);



    var events = 100000;
    var start = new Date().getTime();

    for (var i = 0 ; i < events ; i++) {
        page.write({});
    }
    page.end();

    var end = new Date().getTime();
    var elapsed = end - start;
    console.log('elapsed time ' + elapsed + 'ms generating ' + events + ' events. ' + (events / elapsed) + ' events / ms' );


})
