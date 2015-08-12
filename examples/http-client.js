var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon),
    request = require('request');

Cuddles.monkeyPatchBacon();
Cuddles.monkeyPatchNodesStreams(require('stream'));

var ARTISTS_RELATED_TO_TAYLOR_SWIFT = 
  "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/related-artists";

// request.get( ARTISTS_RELATED_TO_TAYLOR_SWIFT );
require('fs').createReadStream('/Users/phodgson/tmp/related-artists.json')
  .asBaconStream()
  .map( JSON.parse )
  .map( pluckArtistNamesFromResponse )
  .flatMap( Bacon.fromArray )
  .map(".toUpperCase")
  .map(appendNewLine)
  .pipeInto(process.stdout);

function pluckArtistNamesFromResponse(jsonResponse){
  return jsonResponse.artists.map( function(artistJson){
    return artistJson.name;
  });
}

function appendNewLine(str){
  return str+"\n";
}
