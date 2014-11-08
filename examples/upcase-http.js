var request = require('request'),
    Cuddles = require('../index.js');

var upcase = function(x){ return x.toString().toUpperCase() };

var httpStream = Cuddles.nodeToBacon( request.get('https://api.spotify.com/v1/search?type=artist&q=aphex+twin') )

Cuddles.baconToNode( httpStream.map( upcase ) ).pipe( process.stdout );
