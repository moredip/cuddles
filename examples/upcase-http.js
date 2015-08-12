var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);
    request = require('request');

var TAYLOR_SWIFT = "06HL4z0CvFAxyc27GXpf02";

var urlForArtistsRelatedTo = function(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

var pluckArtistNamesFromResponse = function(jsonResponse){
  return jsonResponse.artists.map( function(artistJson){
    return artistJson.name;
  });
}

Cuddles.monkeyPatchBacon();

var upcase = function(x){ return x.toString().toUpperCase() };

Bacon.fromNodeStream( request.get( urlForArtistsRelatedTo(TAYLOR_SWIFT) ) )
  .map( JSON.parse )
  .map( pluckArtistNamesFromResponse )
  .flatMap( Bacon.fromArray )
  .map( upcase )
  .map( function(x){ return x+"\n"; } )
  .pipeInto( process.stdout );
