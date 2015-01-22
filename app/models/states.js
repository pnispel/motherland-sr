var mongoose = require('mongoose');

module.exports = mongoose.model('States', {
  type: String,
  id: String,
  properties: {name:String},
  geometry: {
    type: {type: String},
    coordinates:[]
  }
});
