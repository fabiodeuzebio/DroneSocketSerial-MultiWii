/* Server SerialPort */
var SerialPort = require("serialport").SerialPort;    
var gps = require('./gps');
var MSP = require('./msp');

var sp;

var serial = {
	porta : "",
	baudrate : 0,
	control : 0,	
}

serial.conect = function(porta, baudrate, control){
   
    sp = new SerialPort(porta, { baudrate: baudrate}, false);
    this.porta = porta;
    this.baudrate = baudrate;
    this.control = control;
    console.log('Conectou com Sucesso!');

    sp.open(function (error) {
	  	if ( error ) {
	    	console.log('Falha ao abrir a Porta: '+error);
	  	} else {
	    	console.log('COM22 aberta a 115200 BPS, esperando 5 segundos para requisitar dados');
		}
	});

	sp.on("open", function() {	    
	    
	    sp.on('data', function(data) {
	        MSP.read(data);
	    });

	    sleep(5000);
	    
	    setInterval(requestLoop, 200);    
	});
}

function sleep(time) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {;
    }
}

function requestLoop() {
    sp.write(MSP.msg(MSP.codes.MSP_RAW_GPS));
    //sp.write(MSP.msg(MSP.codes.MSP_ALTITUDE));
    //sp.write(MSP.msg(MSP.codes.MSP_ATTITUDE));
    //sp.write(MSP.msg(MSP.codes.MSP_RAW_IMU));
    //sp.write(MSP.msg(MSP.codes.MSP_MOTOR));
    //sp.write(MSP.msg(MSP.codes.MSP_RC));
    //sp.write(MSP.msg(MSP.codes.MSP_PIDNAMES));  
    //sp.write(MSP.msg(MSP.codes.MSP_IDENT));
    //sp.write(MSP.msg(MSP.codes.MSP_STATUS));
}    

module.exports = serial;