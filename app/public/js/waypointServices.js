(function() {

	'use strict';

	angular.module('myApp.waypointservice', [])
		.factory('WaypointHist', WaypointHist);

	function WaypointHist() {

		var waypoints = [],
		    Markers = [],
		    paths;


		var metodos = {			
			getPoints: function() {
				return waypoints;
			},
			addPoint: function(point) {
				waypoints.push(point);				
			},
			updatePoint: function(points){
				waypoints = points;
			},			           
			getMakers: function() {
				return Markers;
			},
			addMakers: function(mark) {	
				Markers.push(mark);					
			},
			updateMakers: function(markers){
				Markers = markers;
			},
			getPath: function() {
				return paths;
			},
			updatePath: function(path){
				paths = path;
			},
		};

		return metodos;

	}

})();
