(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('map', [
  'resource.counties',
  'resource.states',
  'resource.locations',
  'resource.sliders'
]);

/* -------------------------------------------------------------------------- */

module.directive('map', function () {
  return {
    restrict: 'C',
    templateUrl: '/map/map.tpl.html',
    controller: 'map',
    link: function ($scope, el) {
      function setHeight () {
        if (window.innerHeight >= 480) {
          el.height(window.innerHeight);
        }
      }

      setHeight();
      $(window).resize(setHeight);

      var projection, path;

      var quantize = d3.scale.quantize()
        .domain([0, 1])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

      function buildMap() {
        d3.select('.map svg').remove();

        $scope.map = d3.select('.map').append('svg')
          .style('width', el.width())
          .style('height', el.height())
          .attr('style', 'width: ' + el.width() + '; height: ' + el.height());


        projection = d3.geo.albers()
          .rotate([96, 0])
          .center([-.6, 38.7])
          .parallels([29.5, 45.5])
          .scale(el.width())
          .translate([el.width() / 2, el.height() / 2])
          .precision(.1);

        path = d3.geo.path()
          .projection(projection);
      }

      function resize() {
        buildMap();
        buildCounties();
        buildStates();
      }

      function updateClasses () {
        if (!$scope.locations) return;

        var data = $scope.locations.data;
        var fields = $scope.locations.interesting_fields;
        var sliders = $scope.sliders;

        for (var i = 0; i < data.length; i++) {
          var sum = 0;

          for (var j = 0; j < fields.length; j++) {
            var field = fields[j];
            var datum = data[i][field.name][0];
            var slider = sliders[field.name];
            var total_range = (field.max - field.min);
            var dist_to_slider = Math.abs(datum - slider);
            var percentage = dist_to_slider / total_range;

            sum += percentage;
          }

          $('#' + data[i].fips_county)
            .attr('class', quantize(sum));
        }
      }

      function buildCounties () {
        if (!$scope.counties){return;}

        $scope.map.append('g')
          .attr('class', 'counties')
        .selectAll('path')
          .data($scope.counties)
        .enter().append('path')
          .attr('id', function (d) {
            return d.id
          })
          .attr('d', path);
      }

      function buildStates () {
        if (!$scope.states){return;}

        $scope.map.append('g')
            .attr('class', 'states')
          .selectAll('path')
            .data($scope.states)
          .enter().append('path')
            .attr('d', path);
      }

      var timeout_handle = null;

      $scope.$watch('counties', buildCounties);
      $scope.$watch('states', buildStates);
      $scope.$watch('sliders',
          function () {
        clearTimeout(timeout_handle);
        timeout_handle = setTimeout(updateClasses, 500);
      }, true);

      buildMap();
      updateClasses();

      d3.select(window).on('resize', resize);
    }
  };
});

/* -------------------------------------------------------------------------- */

module.controller('map', function MapController(
    $scope, Counties, States, Locations, Sliders) {
  $scope.loading = true;

  $scope.sliders = Sliders;

  Locations.query({}, function (locations) {
    $scope.locations =  locations;

    Counties.query({}, function (counties) {
      $scope.counties = counties
      $scope.loading = false;

      States.query({}, function (states) {
        $scope.states = states;
      });
    });
  });


});

/* -------------------------------------------------------------------------- */
})();
