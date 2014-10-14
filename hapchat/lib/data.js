// Load modules

var Path = require('path');
var LevelUp = require('level');


// Declare internals

var internals = {
    path: Path.join(__dirname, '../data/hapchat.db'),
    options: {
        valueEncoding: 'json'
    }
};


module.exports.initDb = function initDb() {

    return LevelUp(internals.path, internals.options);
}
