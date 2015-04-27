(function() {

	'use strict';

	/* Controllers */

	angular.module('myApp.controllers', [])
		.controller('RadioControleCtrl', RadioControleCtrl)
	    .controller('SensoresCtrl', SensoresCtrl)
	    .controller('GpsCtrl', GpsCtrl)
	    .controller('MyCtrl', MyCtrl);


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



    /**
     * GPS
     */
    GpsCtrl.$inject = ['$injector'];

    function GpsCtrl($injector) {
        var viewModel = this;
        var DroneService = $injector.get('DroneService');

        viewModel.getAltitude = function() {
            return DroneService.getGpsAltitude();
        }

        viewModel.getGpsSatelites = function() {
            return DroneService.getGpsSatelites();
        }
    }



    /**
     * MyCtrl
     */
    MyCtrl.$inject = ['$injector'];

    function MyCtrl($injector) {
        var viewModel = this;
        var socket = $injector.get('socket');
        var g = 'data.time';
        
        socket.on('send:time', function (data) {
	      var t = data.time;
          console.log(t);
	    });
        
        viewModel.time = function() {
            return g;
        }

        viewModel.serialPort = function(){
            g = 'Fabio';
        }        
    }   
	

})();    