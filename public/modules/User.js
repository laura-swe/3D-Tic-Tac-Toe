var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var url = "mongodb://root:root@ds119129.mlab.com:19129/a3";
//var url = "mongodb://lguevara:VoWrq65U@localhost:27017/cmpt218_lguevara?authSource=admin";
mongoose.connect(url);

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    fname: String,
    lname: String,
    age: String,
    gender: String,
    email: String,
    wins: Number,
    loses: Number
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(user, callback){
    bcrypt.genSalt(10, function (err, salt){
        bcrypt.hash(user.password, salt, null, function(err, hash){
            // store password in db
            user.password = hash;
            user.save(callback);
        });
    });
};

module.exports.getUser = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.checkPassword = function(givenPassword, hash, callback){
    bcrypt.compare(givenPassword, hash, function(err, found){
        if(err) throw err;
        callback(null, found);
    });
};

module.exports.updateWins = function(username){
    User.findOne({username: username}, function(err, user){
        if(err) throw err;
        if(user){
            user.wins += 1;
            user.save(function(err) {
                if (err) throw err;
            });
        }
    });
};

module.exports.updateLoses = function(username){
    User.findOne({username: username}, function(err, user){
        if(err) throw err;
        if(user){
            user.loses += 1;
            user.save(function(err) {
                if (err) throw err;
            });
        }
    });
};

module.exports.getById = function(id, callback){
    User.findById(id, callback);
};

