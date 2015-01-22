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
