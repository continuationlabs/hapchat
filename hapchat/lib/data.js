var Path = require('path');
var LevelUp = require('level');

var internals = {
    path: Path.join(__dirname, '../data/hapchat.db'),
    options: {
        valueEncoding: 'json'
    }
};


module.exports = LevelUp(internals.path, internals.options);
