var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./config/db');
var port = process.env.PORT || 8080;

mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/dist'));

require('./app/routes')(app);

app.listen(port);

console.log('Server listening at ' + port);

exports = module.exports = app;
