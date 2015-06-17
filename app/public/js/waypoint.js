(function() {

	'use strict';

	angular.module('myApp.waypoint', [])
		.factory('WaypointHist', WaypointHist);

	function WaypointHist() {

		var waypoints = [],
		    Markers = [];


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
		};

		return metodos;

	}

})();
