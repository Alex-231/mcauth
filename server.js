// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

//authentication
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var http = require('http');

var path = require('path');

// configuration ===========================================

// config files
var configDB = require('./config/db');

var latestverion = {number: "0.1.1.6"};
var latestverion = {number: latestverion.number, download: path.join(__dirname, '../public/download', latestverion.number + '.zip')}

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.get('/background.png', function(req, res) {
    res.sendfile(path.join(__dirname + '/public/img/background.png'));
});

app.get('/' + latestverion.number + '.zip', function(req, res) {
    res.download(path.join(__dirname + '/public/download/' + latestverion.number + '.zip'), latestverion.number + '.zip');
});

app.get('/launcher', function(req, res) {
    res.download(path.join(__dirname + '/public/download/Banshee Launcher.exe'));
});

app.use(morgan('dev'));
app.use(cookieParser());
//app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');

app.use(session({ secret: 'ThemeScapeMemeScape' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app, passport, latestverion); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

app.listen(port, ip);
console.log("server started on " + ip + ":" + port);