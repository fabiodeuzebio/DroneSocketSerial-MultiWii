(function() {
  var express = require('express');
  var app = module.exports = express();
  var server = require('http').createServer(app);
  var io = require('socket.io').listen(server);
  var socket = require('./app/routes/socket');
  var MSP = require('./app/routes/msp');

  
  app.use(express["static"](__dirname + '/app'));

  // Socket.io Communication
  io.sockets.on('connection', socket);

  MSP.newFrame.on('new', function(data) {
	 io.sockets.emit('dataToUi', data);
  });  

  server.listen(4000, function () {
  	console.log('Express server listening on port 4000');
  });

}).call(this);
