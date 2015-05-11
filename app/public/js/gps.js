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


