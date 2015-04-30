'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  });
  
  
  var connect = require('connect'),	
	app = connect().use(connect.static(__dirname + '/views'));
var socket = require('./routes/socket');	
var MSP = require('./routes/msp');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Socket.io Communication
io.sockets.on('connection', socket);

MSP.newFrame.on('new', function(data) {
	io.sockets.emit('dataToUi', data);
});

server.listen(3000, function () {
  console.log('\n=============================================================');
  console.log('Servidor Node na porta 3000! :)                |');
  console.log('=============================================================');
});
