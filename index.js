'use strict';

var through = require('through');

module.exports = function(Bacon){
  var nodeToBacon = function(nodeStream){
    var baconStream = Bacon.fromBinder( function(sink){
      nodeStream.on( 'data', function(buf){
        sink(buf);
      });
      nodeStream.on( 'end', function(){
        sink( new Bacon.End() );
      });
      nodeStream.on( 'close', function(){
        sink( new Bacon.End() );
      });
      nodeStream.on( 'error', function(e){
        // should we even propogate this into the stream? As I understand it an error in 
        // node Stream world is an internal error with the streaming infra, not an application error.
        sink( new Bacon.Error(e) ); 
      });
      return function(){
        // anything we can do here to clean up the nodeStream?
      };
    });

    return baconStream;
  };
  
  var baconToNode = function(baconStream){
    var nodeStream = through();

    baconStream.onValue( function(val){
      nodeStream.queue(val);
    });
    baconStream.onEnd( function(val){
      nodeStream.end(null);
    });
    baconStream.onError( function (error){
      // what's the best way to handle this?
      nodeStream.queue(error);
    });
     //todo: onError
    return nodeStream;
  };

  var pipeInto_MP = function(nodeStream){
    return baconToNode(this).pipe( nodeStream );
  };
  var fromNodeStream_MP = function(nodeStream){
    return nodeToBacon(nodeStream);
  };

  var monkeyPatchBacon = function(){
    Bacon.Observable.prototype.pipeInto = pipeInto_MP;
    Bacon.fromNodeStream = fromNodeStream_MP;
  };

  return {
    nodeToBacon: nodeToBacon,
    baconToNode: baconToNode,
    monkeyPatchBacon: monkeyPatchBacon
  };
};
