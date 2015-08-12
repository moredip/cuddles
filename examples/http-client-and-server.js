var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon),
    http = require('http'),
    parseUrl = require('url').parse,
    request = require('request');

Cuddles.monkeyPatchBacon();
Cuddles.monkeyPatchNodesStreams(require('stream'));

var server = http.createServer( function(req,res) {
  var artistName = parseUrl(req.url).pathname.split("/")[1];

  res.write("Artists related to "+artistName+"\n---\n\n");

  relatedArtistStream(artistName)
    .map(".toUpperCase")
    .map(appendNewLine)
    .pipeInto(res);
});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);

server.listen(port);
  
function relatedArtistStream(artist){
  //return request.get( urlForArtistsRelatedTo(artist) );
  return require('fs').createReadStream('/Users/phodgson/tmp/related-artists.json')
    .asBaconStream()
    .map( JSON.parse )
    .map( pluckArtistNamesFromResponse )
    .flatMap( Bacon.fromArray )
}

function urlForArtistsRelatedTo(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

function pluckArtistNamesFromResponse(jsonResponse){
  return jsonResponse.artists.map( function(artistJson){
    return artistJson.name;
  });
}

function appendNewLine(str){
  return str+"\n";
}
