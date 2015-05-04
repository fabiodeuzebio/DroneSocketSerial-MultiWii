'use strict';

/* Controllers GPS */

angular.module('myApp.controllers-gps', [])
        .controller('GpsCtrl', GpsCtrl);


/**
 * GPS
 */
GpsCtrl.$inject = ['$injector','$scope'];

function GpsCtrl($injector, $scope) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');
    var home = new google.maps.LatLng(-28.692662, -49.341236);
    var map;

    viewModel.getGpsFix = function(){
        return DroneService.getGpsFix();
    }

          
    viewModel.getAltitude = function() {
        return DroneService.getGpsAltitude();
    }

    viewModel.getGpsSatelites = function() {
        return DroneService.getGpsSatelites();
    }

    viewModel.getGpsLongitude = function(){
        return DroneService.getGpsLongitude();
    }

    viewModel.getGpsLatitude = function(){
        return DroneService.getGpsLatitude();
    }

    viewModel.getGpsVelocidade = function(){
        return DroneService.getGpsVelocidade();
    }

    viewModel.goHome = function() {
        return $scope.map.setCenter(home);
    }
    
    viewModel.setHome = function() {
        home = $scope.map.getCenter();
    }

    viewModel.placeMarker = function(){

        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
            placeMarker.M = function(e) {
                var marker = new google.maps.Marker({position: e.latLng, map: map});
                map.panTo(e.latLng);
            }
        });
    }

}        


