var mongoose = require('mongoose');

var url = "mongodb://root:root@ds119129.mlab.com:19129/a3";
//var url = "mongodb://lguevara:VoWrq65U@localhost:27017/cmpt218_lguevara?authSource=admin";
mongoose.connect(url);

var gameSchema = mongoose.Schema({
    time: Date,
    moves: Number,
    winner: String,
    loser: String,
    active: Boolean
});

var Game = module.exports = mongoose.model('Game', gameSchema);

module.exports.initSession = function(game, callback){
    game.save(callback);
};

module.exports.updateMoves = function(game, number, callback){
    game.moves = number;
    game.save(callback);
};

module.exports.updateStatus = function(game, newStatus, callback){
    game.active = newStatus;
    game.save(callback);
};

module.exports.updateWinner = function(game, name, callback){
    //console.log('winner is '+name);
    game.winner = name;
    game.save(callback);
};

module.exports.updateLoser = function(game, name, callback){
    //console.log('loser is '+name);
    game.loser = name;
    game.save(callback);
};

module.exports.getByDate = function(id, callback){
    return Game.findOne({time: id});
};


