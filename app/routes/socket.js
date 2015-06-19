/*
 * Serve content over a socket
 */
var serial = require('./serial2');

module.exports = function (socket) {  

  socket.on('init', function(data){    	
   	serial.conect(data.porta, data.baudrate, data.control);
  });
  
  //Baixar missao
  socket.on('donwnloadWP', function(){
 	  serial.donwnloadWP();
  });

  //Calibrar Acc
  socket.on('calibrarAcc', function(){
    serial.calibrarAcc();
  });

  //Calibrar Magnetometro
  socket.on('calibrarMag', function(){
    serial.calibrarMag();
  });


};
