var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);
    request = require('request');

Cuddles.monkeyPatchBacon();

var upcase = function(x){ return x.toString().toUpperCase() };

Bacon.fromNodeStream( request.get('https://api.spotify.com/v1/search?type=artist&q=aphex+twin') );
  .map( upcase )
  .pipeInto( process.stdout );
