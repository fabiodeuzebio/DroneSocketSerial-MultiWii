(function() {

    'use strict';

    angular.module('myApp.protocolservice',[])
      .factory('DroneService', DroneService);

    
    DroneService.$inject = ['socket'];


    function DroneService(socket) {
        var metodosPublicos = {
            getGpsAltitude: _getGpsAltitude,
            getGpsSatelites: _getGpsSatelites,
            getGpsLatitude: _getGpsLatitude,
            getGpsLongitude: _getGpsLongitude,
            getGpsVelocidade: _getGpsVelocidade,
            getGpsFix: _getGpsFix,
            getGpsGroundCourse: _gpsGroundCourse
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
                dataService.atitude = data.data[0];
            } else if (data.code == 106) {
                // raw_gps
                dataService.gpsFix = data.data[0];
                dataService.gpsSat = data.data[1];
                dataService.gpsLat = data.data[2];
                dataService.gpsLon = data.data[3];
                dataService.gpsAltitude = data.data[4];
                dataService.gpsSpeed = data.data[5];
                dataService.gpsGroundCourse = data.data[6];
                
            } else if (data.code == 108) {
                // attitude
                dataService.angx = data.data[0]; // 1/10 deg
                dataService.angy = data.data[1]; // 1/10 deg
                dataService.hdg = data.data[2]; // -180 to 180
            }   
            //console.log(data);                            
        });

        function _gpsGroundCourse(){
            return dataService.gpsGroundCourse;
        }

        function _getGpsFix(){
            return dataService.gpsFix;
        }

        function _getGpsAltitude() {
            return dataService.gpsAltitude;
        }

        function _getGpsSatelites() {
            return dataService.gpsSat;
        }

        function _getGpsLatitude(){
            return dataService.gpsLat;
        }

        function _getGpsLongitude(){
            return dataService.gpsLon;
        }

        function _getGpsVelocidade(){
            return dataService.gpsSpeed;
        }


        return metodosPublicos;
    }

})();    