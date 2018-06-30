//Set up basic server
var express = require("express");
var http = require("http");
var path = require("path");
var session = require('express-session');

var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var server = http.createServer(app).listen(25042);

//Database
var MongoClient = require('mongodb').MongoClient;
//var mongoUrl = "mongodb://lguevara:VoWrq65U@localhost:27017/cmpt218_lguevara?authSource=admin";
//var mongoDb = "cmpt218_lguevara";
var mongoUrl = "mongodb://root:root@ds119129.mlab.com:19129/a3";
var mongoDb = "a3";
//App routes


app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// app.use(flash());
// app.use(function(req, res, next){
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("./public"));

// var options = {
//     dotfiles: 'ignore',
//     etag: false,
//     extensions: ['htm', 'html'],
//     index: "login.html"
// }

app.use('/', function (req, res, next) {
    console.log(req.method, 'request:', req.url);
    next();
});

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/fail', function(req, res){
    res.sendFile(path.join(__dirname, 'public/fail.html'));
});

app.get('/lobby', ensureAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, 'public/lobby.html'));
});

app.get('/game', ensureAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, 'public/game.html'));
});

app.get('/stats', ensureAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, 'public/stats.html'));
});

app.get('/logout', ensureAuthenticated, function(req, res){
    req.logout();
    res.sendFile(path.join(__dirname, 'public/logout.html'));
});

app.post('/rawdata', ensureAuthenticated, function(req, res){
    MongoClient.connect(mongoUrl, function (err, client) {
        if (err) throw err;
        var database = client.db(mongoDb);
        var collection = database.collection("games");
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(result));
            res.end();
        });

    });
});

app.post('/usersdata', ensureAuthenticated, function(req, res){
    MongoClient.connect(mongoUrl, function (err, client) {
        if (err) throw err;
        var database = client.db(mongoDb);
        var collection = database.collection("users");
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(result));
            res.end();
        });

    });
});

app.get('/', ensureAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, 'public/lobby.html'));
});

var curUsername ='';
function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        curUsername = req.user.username;
        //console.log(curUsername);
        //console.log("auth");
        return next();
    } else {
        //console.log("not auth");
        res.redirect('./login');
    }
}


var User = require("./public/modules/User.js");

app.post('/new', function (req, res, next) {
    //console.log("new user");
    //console.log(req.body.username);
    //console.log(req.body.password);

    var newPerson = new User({
        username: req.body.username,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        wins: 0,
        loses: 0
    });

    User.createUser(newPerson, function(err, user){
        if(err) throw err;
        console.log(user);
    });

    res.sendFile(path.join(__dirname, 'public/succ.html'));
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUser(username, function(err, user){
            if(err) throw err;
            if(!user){return done(null, false, {message: 'Unknown user'});}
            User.checkPassword(password, user.password, function (err, found) {
                if(err) throw err;

                if(found){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getById(id, function(err, user) {
        //if(err) throw err;
        done(err, user);
    });
});

app.post('/lobby', passport.authenticate('local', {successRedirect: './lobby', failureRedirect: './fail'}),
    function (req, res) {
    //res.render('./lobby', { username: req.body.username })
    //res.sendFile(path.join(__dirname, 'public/lobby.html'));
});

var Game = require("./public/modules/Game.js");

//Socket.io connection
//app.use(express.static("./public"));
//var io = require('socket.io')(server);
var socket = require('socket.io');
var io = socket.listen(server);

var clients = 0;
var m = 0;
var newGame;
var players = [];
var authUsers =[];
var ran = Math.floor(Math.random()*2);
var turn = 0;

io.on('connection', function(socket){
    //console.log(authUsers);
    // if(clients>2){
    //     players = [];
    //     authUsers = [];
    //     clients = 0;
    //     m = 0;
    // }
    if (clients <=2) {
        clients++;
        console.log(clients+" "+curUsername);
        players.push(socket.id);
        authUsers.push(curUsername);

        if (clients == 2) {
            newGame = new Game({
                time: new Date(),
                moves: 0,
                winner: '',
                loser: '',
                active: true
            });
            Game.initSession(newGame, function (err, game) {
                if (err) throw err;
                //console.log(game);
            });
            var selected = players[ran];
            io.sockets.connected[selected].emit('start');
        }

        //console.log('new connection');
        socket.emit("clientChange", clients); //sending only to newly connected socket
        socket.broadcast.emit("clientChange", clients); //emiting to everyone

        socket.on('move', function (row, col, level, color) {
            socket.broadcast.emit('coordinates', row, col, level, color);
            m++;
            Game.updateMoves(newGame, m, function (err) {
                if (err) throw err;
                //console.log("updated moves");
            });
        });

        socket.on('turnSwitch', function () {
            socket.broadcast.emit('turn');
            socket.emit('wait');
            if(turn==0){
                turn=1
            }else{
                turn = 0;
            }
        });

        socket.on('end', function () {
            //console.log("entering end with "+curUsername);
            socket.emit('win');
            //console.log(authUsers);

            var winner;
            var loser;
            if(curUsername == authUsers[0]) {
                winner = 0;
                loser = 1;
            }else{
                winner = 1;
                loser = 0;
            }
            User.updateWins(authUsers[winner]);
            Game.updateWinner(newGame, authUsers[winner], function (err) {
                if(err) throw err;
            });

            User.updateLoses(authUsers[loser]);
            Game.updateLoser(newGame, authUsers[loser], function (err) {
                if(err) throw err;
            });

            socket.broadcast.emit('lost');
            Game.updateStatus(newGame, false, function () {
                //console.log("terminated game");
            });
        });

        socket.on('reset', function () {
            socket.broadcast.emit('reset');
            m = 0;
            Game.updateMoves(newGame, 0, function (err) {
                if (err) throw err;
                //console.log("restarted moves");
            });
        });

        socket.on('surrender', function () {

            socket.broadcast.emit("clientChange", clients); //emiting to everyone

            if (clients == 2) {
                socket.emit('lost');

                socket.broadcast.emit('opsLeft');
                Game.updateStatus(newGame, false, function (err) {
                    if (err) throw err;
                    //console.log("terminated game");
                });

                var winner;
                var loser;
                if(curUsername == authUsers[0]) {
                    winner = 1;
                    loser = 0;
                }else{
                    winner = 0;
                    loser = 1;
                }
                User.updateWins(authUsers[winner]);
                Game.updateWinner(newGame, authUsers[winner], function (err) {
                    if(err) throw err;
                });

                User.updateLoses(authUsers[loser]);
                Game.updateLoser(newGame, authUsers[loser], function (err) {
                    if(err) throw err;
                });
                //socket.broadcast.emit('lost');
            }

            if(clients == 1){
                socket.emit('quit');
            }
            clients--;
        });

        socket.on('disconnect', function () {
            //console.log("Disconnect event");
            socket.broadcast.emit("clientChange", clients); //emiting to everyone
            if (clients == 2) {
                socket.broadcast.emit('win');
                Game.updateStatus(newGame, false, function (err) {
                    if (err) throw err;
                    //console.log("terminated game");
                });
            }
            //clients--;
            players = [];
            authUsers = [];
            clients = 0;
            m = 0;
            ran = Math.floor(Math.random()*2);

        });
    }

});

