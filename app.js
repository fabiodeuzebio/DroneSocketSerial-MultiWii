
var express = require('express'),
    http = require('http');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var socket = require('./routes/socket');
//var serial = require('./routes/serial');
var MSP = require('./routes/msp');

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/bower_components'));

/**-
 * Routes
 */

// index page 
app.get('/', function(req, res) {
  res.render('index');
});

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res) {
  res.render('index');
});


// Socket.io Communication
io.sockets.on('connection', socket);
//serial();

MSP.newFrame.on('new', function(data) {
	io.sockets.emit('dataToUi', data);
});


/**
 * Start Server
 */
server.listen(3000, function () {
  console.log('Express server listening on port 3000');
});
