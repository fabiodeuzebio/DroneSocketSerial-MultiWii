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
    
    viewModel.closeSerial = function() {
        socket.emit('donwnloadWP', {});
    }

    viewModel.serialPort = function(){
    
        socket.emit('init', {
            porta : 'COM22',
            baudrate : 115200,
            control : false,                
        });
    }
    
    viewModel.isActive = function(route){
    	return route == $location.path();
    }   
}