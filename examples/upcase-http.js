var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon),
    http = require('http'),
    request = require('request');

var urlForArtistsRelatedTo = function(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

var pluckArtistNamesFromResponse = function(jsonResponse){
  return jsonResponse.artists.map( function(artistJson){
    return artistJson.name;
  });
}

var streamOfNamesForArtistsRelatedTo = function(artistId){
  //return Bacon.fromNodeStream( request.get( urlForArtistsRelatedTo(artistId) ) )
  return Bacon.fromNodeStream( require('fs').createReadStream('/Users/phodgson/tmp/related-artists.json') )
    .map( JSON.parse )
    .map( pluckArtistNamesFromResponse )
    .flatMap( Bacon.fromArray );
}

var appender = function(toAppend){
  return function(x){ return x+toAppend; };
}

Cuddles.monkeyPatchBacon();

var server = http.createServer( function(req,res) {
  var artistName = require('url').parse(req.url).pathname.split("/")[1];

  res.write("Artists related to ");
  res.write(artistName);
  res.write("\n---\n\n");

  streamOfNamesForArtistsRelatedTo(artistName)
    .map(".toUpperCase")
    .map(appender("\n"))
    .pipeInto(res);
});

var port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);

server.listen(port);
