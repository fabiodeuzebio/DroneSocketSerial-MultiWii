(function() {
  angular.module('myApp', [
    'ngRoute',
    'myApp.filters', 
    'myApp.services', 
    'myApp.directives', 
    'myApp.controllers',
    'myApp.controllers-gerais',
    'myApp.controllers-gps',
    'myApp.protocolservice',
    'btford.socket-io',
    'ngMap'
    ])

  .config(['$routeProvider', function($routeProvider) {
  
      $routeProvider.when('/configuracao', {
        templateUrl: 'partials/config.html',
        controller: 'MyCtrl'
      });

      $routeProvider.when('/principal', {
        templateUrl: 'partials/principal.html',
        controller: 'GpsCtrl'
      });

      $routeProvider.when('/navegacao', {
        templateUrl: 'partials/navegacao.html',
        controller: 'GpsCtrl'
      });

      return $routeProvider.otherwise({
        redirectTo: '/configuracao'
      });
    }
  ]);
}).call(this);



