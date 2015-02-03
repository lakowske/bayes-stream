* bayes-stream

Calculate conditional probability of an event, eg. {cancer : 'true'}, occurring given some
evidence, eg. {diagnosis : "true"}.  In other words, given some evidence, what is the
probability of a specific outcome?

```js
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

    bayes.end();
```

output

```
{ outcome: 'cancer',
  target: 'true',
  actual: 'true',
  matchOutcome: true,
  matched: 1,
  other: 0,
  total: 1,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'true',
  matchOutcome: true,
  matched: 2,
  other: 0,
  total: 2,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'true',
  matchOutcome: true,
  matched: 3,
  other: 0,
  total: 3,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'true',
  matchOutcome: true,
  matched: 3,
  other: 0,
  total: 4,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'false',
  matchOutcome: false,
  matched: 3,
  other: 0,
  total: 5,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'false',
  matchOutcome: false,
  matched: 3,
  other: 0,
  total: 6,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'false',
  matchOutcome: false,
  matched: 3,
  other: 0,
  total: 7,
  conditionalProbability: 1,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 1' }
{ outcome: 'cancer',
  target: 'true',
  actual: 'false',
  matchOutcome: false,
  matched: 3,
  other: 1,
  total: 8,
  conditionalProbability: 0.75,
  msg: 'P( {"cancer":"true"} | {"diagnosis":"true"} ) = 0.75' }
```

The output is the conditional probability object containing statistics
and a user message meant to be human readable.

