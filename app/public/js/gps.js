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
    var path;
    var markers = [];
    var marker;
    var latAnt = -28.692662, 
        latAtual = -28.692662;
    var lonAnt = -49.341236, 
        lonAtual = -49.341236;

    var poly = poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    $scope.$on('mapInitialized', function(evt, map) {
        poly.setMap(map);             
    });

    viewModel.icon = function(){
    return { path: "M254 355 c11 -8 23 -15 28 -15 19 0 5 -20 -27 -39 -46 -27 -78 -23 -118 11 -18 16 -25 28 -17 27 30 -3 50 1 50 10 0 13 -88 7 -102 -7 -7 -7 -22 -12 -35 -12 -13 0 -23 -5 -23 -11 0 -7 10 -9 26 -5 34 9 72 -16 89 -59 16 -38 13 -63 -12 -105 -21 -37 -30 -38 -45 -5 -6 14 -15 25 -20 25 -13 0 -9 -17 8 -34 8 -9 13 -20 9 -26 -3 -5 3 -18 14 -29 11 -11 25 -29 31 -41 6 -12 14 -19 17 -16 4 3 1 17 -7 30 -16 30 -9 50 25 72 33 22 72 22 113 1 38 -20 41 -39 10 -60 -13 -8 -20 -18 -16 -22 3 -4 15 2 25 12 10 10 27 18 38 18 13 0 21 8 23 21 2 12 15 27 30 34 17 8 22 14 14 17 -7 3 -21 -2 -31 -11 -10 -9 -23 -16 -29 -16 -19 0 -52 62 -52 98 0 55 54 116 83 94 24 -18 46 -22 40 -6 -3 7 -11 14 -19 14 -7 0 -22 9 -33 21 -13 14 -26 19 -39 15 -11 -4 -23 -2 -27 4 -3 5 -14 10 -23 10 -15 -1 -15 -2 2 -15z",
             strokeColor: '#F00',
             fillColor: '#000',
             fillOpacity: 1,
             strokeWeight: 0,
             scale: .10,
             rotation: 0};    
    }
    
    viewModel.addMarkerAndPath = function(event){

        path = poly.getPath();

        marker = new google.maps.Marker({
            position: event.latLng, 
            title: "#"+ path.getLength(), 
            map: $scope.map
        });
        
        path.push(event.latLng);
        markers.push(marker); 
        console.log(event.latLng.lat());       
        console.log(event.latLng.lng());       
    } 

    viewModel.removeLine = function(){

        var Indexz;

        if ((markers.length - 1)  < 0){
            Indexz = 0;  
        }else{
            Indexz = markers.length - 1;
        }
        if(markers.length > 0){
            markers[Indexz].setMap(null);
        }               
        path.pop();
        markers.pop();        
    }
    

    viewModel.getGpsLat = function(){

        var ret;
        latAtual = Number(DroneService.getGpsLatitude()).toFixed(6);

        if(latAtual != latAnt && latAtual != null){
            ret = latAtual;
            latAnt = latAtual;
        }else{
            ret = latAnt
        }
        return ret;
    }

    viewModel.getGpsLon = function(){

        var ret;
        lonAtual = Number(DroneService.getGpsLongitude()).toFixed(6);
        
        if(lonAtual != lonAnt && lonAtual != null){
            ret = lonAtual;
            lonAnt = lonAtual;
        }else{
            ret = lonAnt
        }
        return ret;        
    }

    viewModel.getGpsGroundCourse = function(){
        return DroneService.getGpsGroundCourse();
    }

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

}        


