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
            getGpsGroundCourse: _gpsGroundCourse,
            getSensorAccRoll: _getSensorAccRoll,
            getSensorAccPitch: _getSensorAccPitch,
            getSensorAccZ: _getSensorAccZ,
            getSensorGyroRoll: _getSensorGyroRoll,
            getSensorGyroPitch: _getSensorGyroPitch,
            getSensorGyroYaw: _getSensorGyroYaw,
            getSensorMagRoll: _getSensorMagRoll,
            getSensorMagPitch: _getSensorMagPitch,
            getSensorMagYaw: _getSensorMagYaw
        };

        var dataServiceGps = {
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

        var dataServiceWP = {
            wp_no: undefined,
            lat: undefined,
            lon: undefined,
            AltHold: undefined,
            Heading: undefined,
            Time_to_stay: undefined,
            Nav_flag: undefined
        };

        //Sensores IMU
        var dataServiceSensor = {
            accRoll: undefined,
            accPitch: undefined,
            accZ: undefined,
            gyroRoll: undefined,
            gyroPitch: undefined,
            gyroYaw: undefined,
            magRoll: undefined,
            magPitch: undefined,
            magYaw: undefined
        };


        socket.on('dataToUi', function(data) {   

            switch(data.code){
                case 102:
                    //MSP_RAW_IMU
                    dataServiceSensor.accRoll = data[0];
                    dataServiceSensor.accPitch = data[1];
                    dataServiceSensor.accZ = data[2];
                    dataServiceSensor.gyroRoll = data[3];
                    dataServiceSensor.gyroPitch = data[4];
                    dataServiceSensor.gyroYaw = data[5];
                    dataServiceSensor.magRoll = data[6];
                    dataServiceSensor.magPitch = data[7];
                    dataServiceSensor.magYaw = data[8];
                    break;                
                case 106: 
                    //MSP_RAW_GPS
                    dataServiceGps.gpsFix = data.data[0];
                    dataServiceGps.gpsSat = data.data[1];
                    dataServiceGps.gpsLat = data.data[2];
                    dataServiceGps.gpsLon = data.data[3];
                    dataServiceGps.gpsAltitude = data.data[4];
                    dataServiceGps.gpsSpeed = data.data[5];
                    dataServiceGps.gpsGroundCourse = data.data[6];
                    break;
                case 108:
                    //MSP_ATTITUDE
                    dataService.angx = data.data[0]; // 1/10 deg
                    dataService.angy = data.data[1]; // 1/10 deg
                    dataService.hdg = data.data[2]; // -180 to 180
                    break;
                case 109:
                    //MSP_ALTITUDE
                    dataService.atitude = data.data[0];
                    break;
                case 118:
                    //MSP_WP
                    dataServiceWP.wp_no = data.data[0];
                    dataServiceWP.lat = data.data[1];
                    dataServiceWP.lon = data.data[2];
                    dataServiceWP.AltHold = data.data[3];
                    dataServiceWP.Heading = data.data[4];
                    dataServiceWP.Time_to_stay = data.data[5];
                    dataServiceWP.Nav_flag = data.data[6];
                    console.log(data);          
            }                  
        });

        //GPS
        function _gpsGroundCourse(){
            return dataServiceGps.gpsGroundCourse;
        }

        function _getGpsFix(){
            return dataServiceGps.gpsFix;
        }

        function _getGpsAltitude() {
            return dataServiceGps.gpsAltitude;
        }

        function _getGpsSatelites() {
            return dataServiceGps.gpsSat;
        }

        function _getGpsLatitude(){
            return dataServiceGps.gpsLat;
        }

        function _getGpsLongitude(){
            return dataServiceGps.gpsLon;
        }

        function _getGpsVelocidade(){
            return dataServiceGps.gpsSpeed;
        }

        //Sensores
        function _getSensorAccRoll(){
            return dataServiceSensor.accRoll;
        }

        function _getSensorAccPitch(){
            return dataServiceSensor.accPitch;
        }

        function _getSensorAccZ(){
            return dataServiceSensor.accZ;
        }

        function _getSensorGyroRoll(){
            return dataServiceSensor.gyroRoll;
        }

        function _getSensorGyroPitch(){
            return dataServiceSensor.gyroPitch;
        }

        function _getSensorGyroYaw(){
            return dataServiceSensor.gyroYaw;
        }

        function _getSensorMagRoll(){
            return dataServiceSensor.magRoll;
        }

        function _getSensorMagPitch(){
            return dataServiceSensor.magPitch;
        }

        function _getSensorMagYaw(){
            return dataServiceSensor.magYaw;
        }


        return metodosPublicos;
    }

})();    