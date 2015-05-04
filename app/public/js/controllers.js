'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('RadioControleCtrl', RadioControleCtrl)
    .controller('SensoresCtrl', SensoresCtrl);


/**
 * Rádio Controle
 * @type {Array}
 */
RadioControleCtrl.$inject = ['$injector'];

function RadioControleCtrl($injector) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');

    init();

    function init() {
        initName();

        function initName() {
            getName();
        }
    }

    function getName() {
        viewModel.gpsAltitude = DroneService.getGpsAltitude();
    }
}


/**
 * Sensores
 * @type {Array}
 */
SensoresCtrl.$inject = ['$injector'];

function SensoresCtrl($injector) {
    var viewModel = this;
    var DroneService = $injector.get('DroneFabio.DroneService');

    init();

    function init() {
        initName();

        function initName() {
            getName();
        }
    }

    function getName() {
        viewModel.gpsAltitude = DroneService.getGpsAltitude();
    }

}



