var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);

Cuddles.monkeyPatchBacon();

var upcase = function(x){ return x.toString().toUpperCase() };

var upcasedBacon = Cuddles.nodeToBacon( process.stdin ).map( upcase );
upcasedBacon.pipeInto( process.stdout );
