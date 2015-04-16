var express = require('express'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



/**
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
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */
server.listen(3000, function () {
  console.log('Express server listening on port 3000');
});