(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('motherland', [
  'templates',
  'header',
  'map',
  'sliders',
  'smoothScroll'
]);

/* -------------------------------------------------------------------------- */
})();

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

(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('resource.counties', [
  'ngResource'
]);

/* -------------------------------------------------------------------------- */

module.factory('Counties', function($resource) {
  return $resource('/api/counties');
});

/* -------------------------------------------------------------------------- */
})();

(function () {
// -------------------------------------------------------------------------- */
/* Author: Paul Nispel */
// -------------------------------------------------------------------------- */

var module = angular.module('resource.locations', [
  'ngResource'
]);

/* -------------------------------------------------------------------------- */

module.factory('Locations', function($resource) {
  /*
    aqsid: String,
    name: String,
    lat: Number,
    lng: Number,
    agency: String,
    state : String,
    fips_county : String,
    county : String,
    population_avg : Number,
    population_density_avg: Number,
    aqi_average : Number,
    avg_salary : Number,
    avg_unemployment : Number,
    arrests : Number
  */

  return $resource('/api/locations', {}, {
    query: {
      method: 'GET',
      cache : true,
      transformResponse: function(data, headers){
        data = JSON.parse(data);

        var hash = {};

        var interesting_fields = [
          {
            name: 'population_avg',
            name_pretty: 'Population',
            max: _.max(data, function (d) {return d.population_avg}).population_avg.toFixed(0),
            min: _.min(data, function (d) {return d.population_avg}).population_avg.toFixed(0)
          },
          {
            name: 'population_density_avg',
            name_pretty: 'Pop Density',
            max: _.max(data, function (d) {return d.population_density_avg}).population_density_avg.toFixed(0),
            min: _.min(data, function (d) {return d.population_density_avg}).population_density_avg.toFixed(0)
          },
          {
            name: 'aqi_average',
            name_pretty: 'Air Quality',
            max: _.max(data, function (d) {return d.aqi_average}).aqi_average.toFixed(2),
            min: _.min(data, function (d) {return d.aqi_average}).aqi_average.toFixed(2),
            reverse: true
          },
          {
            name: 'avg_salary',
            name_pretty: 'Salary',
            max: _.max(data, function (d) {return d.avg_salary}).avg_salary.toFixed(0),
            min: _.min(data, function (d) {return d.avg_salary}).avg_salary.toFixed(0)
          },
          {
            name: 'avg_unemployment',
            name_pretty: 'Unemployment',
            max: _.max(data, function (d) {return d.avg_unemployment}).avg_unemployment.toFixed(2),
            min: _.min(data, function (d) {return d.avg_unemployment}).avg_unemployment.toFixed(2),
            reverse: true
          },
          {
            name: 'arrests',
            name_pretty: 'Crime',
            max: _.max(data, function (d) {return d.arrests}).arrests.toFixed(0),
            min: _.min(data, function (d) {return d.arrests}).arrests.toFixed(0),
            reverse: true
          }
        ];

        var population_avg = interesting_fields[0];
        var population_density_avg =  interesting_fields[1];
        var aqi_average =  interesting_fields[2];
        var avg_salary =  interesting_fields[3];
        var avg_unemployment =  interesting_fields[4];
        var arrests =  interesting_fields[5];

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];

          datum.population_avg = [datum.population_avg, (datum.population_avg - population_avg.min) / (population_avg.max - population_avg.min)];
          datum.population_density_avg = [datum.population_density_avg , (datum.population_density_avg - population_density_avg.min) / (population_density_avg.max - population_density_avg.min)];
          datum.aqi_average = [datum.aqi_average, (datum.aqi_average - aqi_average.min) / (aqi_average.max - aqi_average.min)];
          datum.avg_salary = [datum.avg_salary, (datum.avg_salary - avg_salary.min) / (avg_salary.max - avg_salary.min)];
          datum.avg_unemployment = [datum.avg_unemployment, (datum.avg_unemployment - avg_unemployment.min) / (avg_unemployment.max - avg_unemployment.min)];
          datum.arrests = [datum.arrests, (datum.arrests - arrests.min) / (arrests.max - arrests.min)];

          hash[datum.fips_county] = datum;
        }

        return {interesting_fields: interesting_fields, data: data, hash: hash};
      }
    }
  });
});

/* -------------------------------------------------------------------------- */
})();

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
