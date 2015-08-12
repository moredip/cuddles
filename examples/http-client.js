var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon),
    request = require('request'),
    JSONStream = require('JSONStream');
    

Cuddles.monkeyPatchBacon();

var URL_FOR_ARTISTS_RELATED_TO_TAYLOR_SWIFT = 
  "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02/related-artists";

var relatedArtistsStream = 
  request.get(URL_FOR_ARTISTS_RELATED_TO_TAYLOR_SWIFT)
    .pipe(JSONStream.parse("artists.*"));

 Cuddles.nodeToBacon( relatedArtistsStreams )
  .map( ".name" )
  .map(".toUpperCase")
  .map(appendNewLine)
  .pipeInto(process.stdout);

function appendNewLine(str){
  return str+"\n";
}
