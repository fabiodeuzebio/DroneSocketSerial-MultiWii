'use strict';

/* Controllers GPS */

angular.module('myApp.controllers-gps', [])
    .controller('GpsCtrl', GpsCtrl);


/**
 * GPS
 */
GpsCtrl.$inject = ['$injector', '$scope'];

function GpsCtrl($injector, $scope) {
    var viewModel = this;
    var DroneService = $injector.get('DroneService');
    var WaypointHist = $injector.get('WaypointHist');  
    var socket = $injector.get('socket');   
    
    var map;
    //var paths = [];
    var path;
    var ponto;
    var markers = [];
    var marker;
    var position;
    var latAnt = -28.692662,
        latAtual = -28.692662;
    var lonAnt = -49.341236,
        lonAtual = -49.341236;

    var poly = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });        

    $scope.$on('mapInitialized', function(evt, map) {
        poly.setMap(map);       
    });
     
    markers = WaypointHist.getMakers();    
    path = WaypointHist.getPath();
    ponto = WaypointHist.getPoints();
    $scope.points = ponto;

    
    backupMarkers(markers, path);

    function backupMarkers(pontoSalvos, patch){
        marker = undefined;
        
        pontoSalvos.forEach(function(item, index, array){
            //seta os pontos no mapa
            newMarker(array[index].position,item); 
            console.log("pontoSalvos " + array[index].position); 
            // console.log("patch " + patch[index]);                       
        });
    }
    

    //HOME POSITION (wp 0)  HOLD position (wp 15)
    function point(wp_no, lat, lon, AltHold, heading, time_to_stay, nav_flag) {
        this.wp_no = wp_no;
        this.lat = lat;
        this.lon = lon;
        this.AltHold = AltHold;
        this.heading = heading;
        this.time_to_stay = time_to_stay;
        this.nav_flag = nav_flag;
    }
    
    //Image do Drone plotado no mapa
    viewModel.icon = function() {
        return {
            path: "M254 355 c11 -8 23 -15 28 -15 19 0 5 -20 -27 -39 -46 -27 -78 -23 -118 11 -18 16 -25 28 -17 27 30 -3 50 1 50 10 0 13 -88 7 -102 -7 -7 -7 -22 -12 -35 -12 -13 0 -23 -5 -23 -11 0 -7 10 -9 26 -5 34 9 72 -16 89 -59 16 -38 13 -63 -12 -105 -21 -37 -30 -38 -45 -5 -6 14 -15 25 -20 25 -13 0 -9 -17 8 -34 8 -9 13 -20 9 -26 -3 -5 3 -18 14 -29 11 -11 25 -29 31 -41 6 -12 14 -19 17 -16 4 3 1 17 -7 30 -16 30 -9 50 25 72 33 22 72 22 113 1 38 -20 41 -39 10 -60 -13 -8 -20 -18 -16 -22 3 -4 15 2 25 12 10 10 27 18 38 18 13 0 21 8 23 21 2 12 15 27 30 34 17 8 22 14 14 17 -7 3 -21 -2 -31 -11 -10 -9 -23 -16 -29 -16 -19 0 -52 62 -52 98 0 55 54 116 83 94 24 -18 46 -22 40 -6 -3 7 -11 14 -19 14 -7 0 -22 9 -33 21 -13 14 -26 19 -39 15 -11 -4 -23 -2 -27 4 -3 5 -14 10 -23 10 -15 -1 -15 -2 2 -15z",
            strokeColor: '#F00',
            fillColor: '#000',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: .10,
            rotation: DroneService.getOthersHdg()
        };
    }
     
    viewModel.addMarkerAndPath = function(event) {

        if(markers.length >= 2){
            removeLinha();
        }
                
        path = getPath();
        position = event.latLng;

        //seta os pontos no mapa
        newMarker(position,path.getLength());  
        
        //traça os pontos
        path.push(position);        

        newPoint(position);

        //Serviços para guardar os pontos
        WaypointHist.addMakers(marker);
        WaypointHist.updatePath(path);
        WaypointHist.addPoint(ponto);     
    }

    function newPoint(coodernadas){
        ponto = new point(
            point.wp_no++,
            coodernadas.lat(),
            coodernadas.lng(),
            25,
            undefined,
            undefined,
            undefined
        );
    }

    function newMarker(coodernadas, patch){
        marker = new google.maps.Marker({
            position: coodernadas,
            title: "#" + patch,
            map: $scope.map
        });
    }    

    function getPath(){        
        return poly.getPath();
    }

    function removeLinha(){
        viewModel.removeLine();
    }

    viewModel.removeLine = function() {

        var indexz;

        if ((markers.length - 1) < 0) {
            indexz = 0;
        } else {
            indexz = markers.length - 1;
        }
        if (markers.length > 0) {
            markers[indexz].setMap(null);
        }
        path.pop();
        markers.pop();
        $scope.points.pop();
        WaypointHist.updatePoint($scope.points);
    }




/* ************************************************************************************************ */

    viewModel.getGpsLat = function() {

        var ret;
        latAtual = Number(DroneService.getGpsLatitude()).toFixed(6);

        if (latAtual != latAnt && latAtual != null) {
            ret = latAtual;
            latAnt = latAtual;
        } else {
            ret = latAnt
        }
        return ret;
    }


    viewModel.getGpsLon = function() {

        var ret;
        lonAtual = Number(DroneService.getGpsLongitude()).toFixed(6);

        if (lonAtual != lonAnt && lonAtual != null) {
            ret = lonAtual;
            lonAnt = lonAtual;
        } else {
            ret = lonAnt
        }
        return ret;
    }

    viewModel.getGpsGroundCourse = function() {
        return DroneService.getGpsGroundCourse();
    }

    viewModel.getGpsFix = function() {
        return DroneService.getGpsFix();
    }


    viewModel.getAltitude = function() {
        return DroneService.getGpsAltitude();
    }

    viewModel.getGpsSatelites = function() {
        return DroneService.getGpsSatelites();
    }

    viewModel.getGpsLongitude = function() {
        return DroneService.getGpsLongitude();
    }

    viewModel.getGpsLatitude = function() {
        return DroneService.getGpsLatitude();
    }

    viewModel.getGpsVelocidade = function() {
        return DroneService.getGpsVelocidade();
    }

    //Baixar missao
    viewModel.donwnloadWP = function() {
        socket.emit('donwnloadWP', {});
    }

}
