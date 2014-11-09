var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);
    request = require('request');

Cuddles.monkeyPatchBacon();

var upcase = function(x){ return x.toString().toUpperCase() };

var httpStream = Cuddles.nodeToBacon( request.get('https://api.spotify.com/v1/search?type=artist&q=aphex+twin') )

httpStream.map( upcase ).pipeInto( process.stdout );
