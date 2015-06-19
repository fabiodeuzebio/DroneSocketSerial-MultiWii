'use strict';

/* Controllers-sensor */

angular.module('myApp.controllers-sensor', [])
    .controller('SensoresCtrl', SensoresCtrl);

/**
 * Sensores
 * @type {Array}
 */
SensoresCtrl.$inject = ['$injector'];

function SensoresCtrl($injector) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');

    viewModel.getSensorAccRoll = function(){
        return  DroneService.getSensorAccRoll();
    } 

    viewModel.getSensorAccPitch = function(){
        return DroneService.getSensorAccPitch();
    }

    viewModel.getSensorAccZ = function(){
        return DroneService.getSensorAccZ();
    }

    viewModel.getSensorGyroRoll = function(){
        return DroneService.getSensorGyroRoll();
    }

    viewModel.getSensorGyroPitch = function(){
        return DroneService.getSensorGyroPitch();
    }

    viewModel.getSensorGyroYaw = function(){
        return DroneService.getSensorGyroYaw();
    }

    viewModel.getSensorMagRoll = function(){
        return DroneService.getSensorMagRoll();
    }

    viewModel.getSensorMagPitch = function(){
        return DroneService.getSensorMagPitch();
    }

    viewModel.getSensorMagYaw = function(){
        return DroneService.getSensorMagYaw();
    }

}
