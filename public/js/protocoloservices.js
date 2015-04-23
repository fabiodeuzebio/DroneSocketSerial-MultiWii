(function() {

    'use strict';

    angular.module('myApp.protocolservice',[])
      .factory('DroneService', DroneService);

    
    DroneService.$inject = ['socket'];


    function DroneService(socket) {
        var metodosPublicos = {
            getGpsAltitude: _getGpsAltitude,
            getGpsSatelites: _getGpsSatelites
        };

        var dataService = {
            altitude: undefined,
            gpsAltitude: undefined,
            gpsSat: undefined,
            gpsLat: undefined,
            gpsLon: undefined,
            gpsSpeed: undefined,
            angx: undefined,
            angy: undefined,
            hdg: undefined
        };


        socket.on('dataToUi', function(data) {            

            if (data.code == 109) {
                // altitude
                dataService.altitude = data.data[0];
            } else if (data.code == 106) {
                // raw_gps
                dataService.gpsSat = data.data[1];
                dataService.gpsLat = data.data[2];
                dataService.gpsLon = data.data[3];
                dataService.gpsAltitude = data.data[4];
                dataService.gpsSpeed = data.data[5];
                
            } else if (data.code == 108) {
                // attitude
                dataService.angx = data.data[0]; // 1/10 deg
                dataService.angy = data.data[1]; // 1/10 deg
                dataService.hdg = data.data[2]; // -180 to 180
            }   
            console.log(data);                            
        });

        function _getGpsAltitude() {
            return dataService.altitude;
        }

        function _getGpsSatelites() {
            return dataService.gpsSat;
        }


        return metodosPublicos;
    }

})();    