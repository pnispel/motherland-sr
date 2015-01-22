(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('resource.sliders', []);

/* -------------------------------------------------------------------------- */

module.factory('Sliders', function(Locations) {
  return {
    population_avg: 0,
    population_density_avg: 0,
    aqi_average: 0,
    avg_salary: 0,
    avg_unemployment: 0,
    arrests: 0
  };
});

/* -------------------------------------------------------------------------- */
})();
