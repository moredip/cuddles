var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);

Cuddles.monkeyPatchBacon();

var upcase = function(x){ return x.toString().toUpperCase() };

Bacon.fromNodeStream( process.stdin )
  .map( upcase )
  .pipeInto( process.stdout );
