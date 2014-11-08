var through = require('through');
var Bacon = require('baconjs').Bacon;

var nodeToBacon = function(nodeStream){
  var baconStream = Bacon.fromBinder( function(sink){
    nodeStream.on( 'readable', function(){
      var buf = process.stdin.read();
      if( buf !== null ){
        sink(buf);
      }
    });
    return function(){
      // TODO: unbind handler
    };
  });

  return baconStream;
};

nodeToBacon( process.stdin ).map( function(x){
  return x.toString().toUpperCase();
}).log();

var aBaconStream = Bacon.sequentially(300, ["B", "A", "C", "O", "N"]);
