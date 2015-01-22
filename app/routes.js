var Counties = require('./models/counties');
var States = require('./models/states');
var Locations = require('./models/locations');

module.exports = function(app) {
  app.get('/api/counties', function(req, res) {
    Counties.find(function(err, counties) {
      if (err) {
        res.send(err);
      }

      res.json(counties);
    });
  });

  app.get('/api/states', function(req, res) {
    States.find(function(err, states) {
      if (err) {
        res.send(err);
      }

      res.json(states);
    });
  });

  app.get('/api/locations', function(req, res) {
    Locations.find(function(err, locations) {
      if (err) {
        res.send(err);
      }

      res.json(locations);
    });
  });

  // catchall
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
};
