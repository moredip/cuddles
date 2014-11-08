var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js');

var baconStream = Bacon.sequentially(100, ["B", "A", "C", "O", "N"]);

Cuddles.baconToNode(baconStream).pipe( process.stdout );
