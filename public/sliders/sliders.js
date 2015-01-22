(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('sliders', [
  'rzModule',
  'ui.sortable',
  'resource.sliders',
  'resource.locations'
]);

/* -------------------------------------------------------------------------- */

module.directive('sliders', function () {
  return {
    restrict: 'C',
    templateUrl: '/sliders/sliders.tpl.html',
    controller: 'sliders'
  };
});

/* -------------------------------------------------------------------------- */

module.controller('sliders', function SlidersController($scope, Sliders, Locations) {
  $scope.sliders = Sliders;

  $scope.interesting_fields = [];

  Locations.query({}, function (locations) {
    $scope.interesting_fields = locations.interesting_fields;

    locations.interesting_fields.forEach(function (f){
      $scope.sliders[f.name] = f.min;
    });
  });

  $scope.dragControlListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) {return true},
    itemMoved: function (event) {},
    orderChanged: function(event) {},
    containment: '#fields'
  };
});

/* -------------------------------------------------------------------------- */
})();
