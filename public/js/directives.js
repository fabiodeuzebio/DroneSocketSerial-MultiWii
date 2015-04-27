'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('activeLink', function () {
    return {
        link: function (scope, element, attrs) {
            element.find('.nav a').on('click', function () {
                angular.element(this)
                    .parent().siblings('.active')
                    .removeClass('active');
                angular.element(this)
                    .parent()
                    .addClass('active');
            });
        }
    };
});

