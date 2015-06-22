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

    viewModel.getOthersDebug3 = function(){
        return DroneService.getOthersDebug3();
    }

    viewModel.getOthersHdg = function(){
        return DroneService.getOthersHdg();
    }

    viewModel.getOthersAltitude = function(){
        return DroneService.getOthersAltitude();
    }

    viewModel.getOthersArmado = function(){
        if (DroneService.getOthersArmado() == 1){
            return "success";
        }else{
            return "primary";
        }       
    }

    viewModel.getOtherSensor = function(opc){
        
        // ACC & 1
        // BARO & 2
        // MAG & 4
        // GPS & 8
        // SONAR & 16

        if ((DroneService.getOtherSensor() & opc) != 0){
            return "success";
        }else{
            return "primary";
        }       
    }

}
