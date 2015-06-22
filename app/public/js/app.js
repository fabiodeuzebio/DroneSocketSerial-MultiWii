(function() {
  angular.module('myApp', [
    'ngRoute',
    'myApp.filters',     
    'myApp.directives', 
    'myApp.controllers-rc',
    'myApp.controllers-gerais',
    'myApp.controllers-gps',
    'myApp.controllers-sensor',
    'myApp.controllers-motors',
    'myApp.socketservice', 
    'myApp.protocolservice',
    'myApp.waypointservice',
    'btford.socket-io',
    'ngMap'
    ])

  .config(['$routeProvider', function($routeProvider) {
  
      $routeProvider.when('/principal', {
        templateUrl: 'partials/principal.html',
        controller: 'GpsCtrl'
      });

      $routeProvider.when('/navegacao', {
        templateUrl: 'partials/navegacao.html',
        controller: 'GpsCtrl'
      });

      return $routeProvider.otherwise({
        redirectTo: '/principal'
      });
    }
  ]);
}).call(this);



