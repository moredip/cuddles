var Cuddles = require('../index.js');

var upcase = function(x){ return x.toString().toUpperCase() };

var upcasedBacon = Cuddles.nodeToBacon( process.stdin ).map( upcase );
Cuddles.baconToNode(upcasedBacon).pipe( process.stdout );
