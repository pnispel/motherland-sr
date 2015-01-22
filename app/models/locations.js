var mongoose = require('mongoose');

module.exports = mongoose.model('Locations', {
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
});
