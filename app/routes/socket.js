/*
 * Serve content over a socket
 */
var serial = require('./serial2');

module.exports = function (socket) {

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);

  socket.on('init', function(data){    	
   	serial.conect(data.porta, data.baudrate, data.control);
  });
};
