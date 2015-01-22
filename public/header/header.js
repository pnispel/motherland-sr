(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('header', []);

/* -------------------------------------------------------------------------- */

module.directive('header', function (smoothScroll) {
  return {
    restrict: 'C',
    templateUrl: '/header/header.tpl.html',
    controller: 'header',
    link: function ($scope, el) {
      function setHeight () {
        if (window.innerHeight >= 480) {
          el.height(window.innerHeight);
        }
      }

      setHeight();
      $(window).resize(setHeight);

      $scope.moveToMap = function () {
        smoothScroll($('#map')[0]);
      };
    }
  };
});

/* -------------------------------------------------------------------------- */

module.controller('header', function HeaderController($scope) {

});

/* -------------------------------------------------------------------------- */
})();
