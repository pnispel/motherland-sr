(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('resource.states', [
  'ngResource'
]);

/* -------------------------------------------------------------------------- */

module.factory('States', function($resource) {
  return $resource('/api/states');
});

/* -------------------------------------------------------------------------- */
})();
