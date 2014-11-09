var Bacon = require('baconjs').Bacon,
    Cuddles = require('../index.js')(Bacon);

Cuddles.monkeyPatchBacon();

var baconStream = Bacon.sequentially(100, ["B", "A", "C", "O", "N"]);

baconStream.pipeInto( process.stdout );
