var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon),
    http = require('http'),
    parseUrl = require('url').parse,
    request = require('request'),
    JSONStream = require('JSONStream');

Cuddles.monkeyPatchBacon();

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
  var artistsStream = 
    //require('fs').createReadStream('/Users/phodgson/tmp/related-artists.json')
    request.get(urlForArtistsRelatedTo(artist))
      .pipe(JSONStream.parse("artists.*"));

   return Cuddles.nodeToBacon( artistsStream )
    .map( ".name" );
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
