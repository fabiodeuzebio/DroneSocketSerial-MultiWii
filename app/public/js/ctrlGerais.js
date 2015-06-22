'use strict';

/* Controllers Gerais */

angular.module('myApp.controllers-gerais', [])
        .controller('MyCtrl', MyCtrl);

/**
 * MyCtrl
 */
MyCtrl.$inject = ['$injector', '$location'];

function MyCtrl($injector, $location) {
    var viewModel = this;

    var socket = $injector.get('socket');

    //Conectar Drone
    viewModel.serialPort = function(){ 

        socket.emit('init', {
            porta : 'COM37',
            baudrate : 57600,
            control : false,                
        });
    }

    //Calibrar acelerometro
    viewModel.calibrarAcc = function(){
        socket.emit('calibrarAcc', {});
    }

    //Calibrar Magnetometro
    viewModel.calibrarMag = function(){
        socket.emit('calibrarMag', {});
    }
    
    viewModel.isActive = function(route){
    	return route == $location.path();
    }   
}