'use strict';

/* Services */

angular.module('myApp.socketservice', []).
  factory('socket', function (socketFactory) {
    return socketFactory();
  }).
  value('version', '0.1');
