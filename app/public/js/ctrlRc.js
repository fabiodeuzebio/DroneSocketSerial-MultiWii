'use strict';

/* Controllers */

angular.module('myApp.controllers-rc', [])
	.controller('RadioControleCtrl', RadioControleCtrl);


/**
 * Rádio Controle
 * @type {Array}
 */
RadioControleCtrl.$inject = ['$injector'];

function RadioControleCtrl($injector) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');
    var valorMax = 2000,
        valorMin = 1000;
    var rcAux = [];    

    viewModel.getRcThr = function(opc){
        var thr = DroneService.getRcThr();

        rcAux[0] = thr;
        rcAux[1] = getPercentual(thr);

        return rcAux[opc];
    }

    viewModel.getRcRoll = function(opc){
        var roll = DroneService.getRcRoll();

        rcAux[0] = roll;
        rcAux[1] = getPercentual(roll);

        return rcAux[opc];
    }

    viewModel.getRcPitch = function(opc){
        var pitch =  DroneService.getRcPitch();

        rcAux[0] = pitch;
        rcAux[1] = getPercentual(pitch);

        return rcAux[opc];
    }

    viewModel.getRcYaw = function(opc){
        var yaw = DroneService.getRcYaw();

        rcAux[0] = yaw;
        rcAux[1] = getPercentual(yaw);       

        return rcAux[opc];
    }

    viewModel.getRcAux1 = function(opc){
        var aux1 = DroneService.getRcAux1();

        rcAux[0] = aux1;
        rcAux[1] = getPercentual(aux1);

        return rcAux[opc];
    }

    viewModel.getRcAux2 = function(opc){
        var aux2 = DroneService.getRcAux2();

        rcAux[0] = aux2;
        rcAux[1] = getPercentual(aux2);


        return rcAux[opc];
    }

    function getPercentual(valor){
        if(valor == undefined) valor = 1500;
        var percent = ((valor - 1000) / 1000) * 100;

        return percent;
    }


}





