var mongoose = require('mongoose');

module.exports = mongoose.model('Counties', {
  type: String,
  id: String,
  properties: {name:String},
  geometry: {
    type: { type: String },
    coordinates:[]
  }
});
