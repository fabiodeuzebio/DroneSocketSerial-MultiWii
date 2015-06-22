'use strict';

/* Controllers */

angular.module('myApp.controllers-motors', [])
	.controller('PwmMotors', PwmMotors);


/**
 * PWM Motors
 * @type {Array}
 */
PwmMotors.$inject = ['$injector'];

function PwmMotors($injector) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');
    var valorMax = 2000,
        valorMin = 1000;
    var mAux = [];    

    viewModel.getM1 = function(opc){
        var pwm = DroneService.getMotorsM1();

        mAux[0] = pwm;
        mAux[1] = getPercentual(pwm);

        return mAux[opc];
    }

    viewModel.getM2 = function(opc){
        var pwm = DroneService.getMotorsM2();

        mAux[0] = pwm;
        mAux[1] = getPercentual(pwm);

        return mAux[opc];
    }

    viewModel.getM3 = function(opc){
        var pwm =  DroneService.getMotorsM3();

        mAux[0] = pwm;
        mAux[1] = getPercentual(pwm);

        return mAux[opc];
    }

    viewModel.getM4 = function(opc){
        var pwm = DroneService.getMotorsM4();

        mAux[0] = pwm;
        mAux[1] = getPercentual(pwm);       

        return mAux[opc];
    }

    function getPercentual(valor){
        if(valor == undefined) valor = 1500;
        var percent = ((valor - 1000) / 1000) * 100;

        return percent;
    }


}





