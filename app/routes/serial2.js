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
	    	console.log('COM37 aberta a 57600 BPS, esperando 5 segundos para requisitar dados');
		}
	});

	sp.on("open", function() {	    
	    
	    sp.on('data', function(data) {
	        MSP.read(data);	        
	    });

	    sleep(5000);
	    
	    setInterval(requestLoop, 200);    
	});

	sp.on("close", function() {	    
	    
	    sp.close(function (error) {
	  		if ( error ) {
	    		console.log('Falha ao Fechar a Porta: '+error);
	  		} else {
	    		console.log('Porta Serial Fechada');
			}
		});    
	});
}

serial.donwnloadWP = function(){
    var wp = 1;
    var finished = false;

    while (!finished){
        msgWP(wp);

        wp++;
        if (MSP.getStep().flag == MSP.MISSION_FLAG_END) {
            finished = true;
        }
    }
}

serial.calibrarAcc = function(){
    sp.write(MSP.msg(MSP.codes.MSP_ACC_CALIBRATION)); 
}

serial.calibrarMag = function(){
    sp.write(MSP.msg(MSP.codes.MSP_MAG_CALIBRATION)); 
}


function msgWP(wp) {
    var bufferOut;
    var bufView;
        
    bufferOut = new ArrayBuffer(10);
    bufView = new Uint8Array(bufferOut);
    var c;
    
    bufView[0] = 36; // $
    bufView[1] = 77; // M
    bufView[2] = 60; // <
    bufView[3] = 1; c ^= bufView[3];
    bufView[4] = MSP.codes.MSP_WP; c ^= bufView[4];
    bufView[5] = wp; c ^= bufView[5];
    bufView[6] = c; // checksum
    
    sp.write(bufView);
}


function sleep(time) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {;
    }
}

function requestLoop() {
    sp.write(MSP.msg(MSP.codes.MSP_RAW_GPS));    
    sp.write(MSP.msg(MSP.codes.MSP_ALTITUDE));    
    sp.write(MSP.msg(MSP.codes.MSP_ATTITUDE));
    sp.write(MSP.msg(MSP.codes.MSP_RAW_IMU));
    sp.write(MSP.msg(MSP.codes.MSP_MOTOR));
    sp.write(MSP.msg(MSP.codes.MSP_RC));
    sp.write(MSP.msg(MSP.codes.MSP_DEBUG));    
    //sp.write(MSP.msg(MSP.codes.MSP_PID));    
    //sp.write(MSP.msg(MSP.codes.MSP_WP));
    //sp.write(MSP.msg(MSP.codes.MSP_PIDNAMES));  
    //sp.write(MSP.msg(MSP.codes.MSP_IDENT));
    sp.write(MSP.msg(MSP.codes.MSP_STATUS));
    //sp.write(MSP.msg(MSP.codes.MSP_BOXNAMES));    
}    

module.exports = serial;