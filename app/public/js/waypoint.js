(function() {

	'use strict';

	angular.module('myApp.waypoint', [])
		.factory('WaypointHist', WaypointHist);

	function WaypointHist() {

		var waypoints = [];

		var metodos = {
			getPoints: function() {
				return waypoints;
			},
			addPoint: function(point) {
				waypoints.push(point);
			},
			update: function(points){
				waypoints = points;
			}
		};

		return metodos;

	}

})();
