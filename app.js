var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var markov = require('./markov.js');

app.get('/gentitle', function(req, res) {
	res.send(markov.titleGen.gen());
});

app.get('/genteaser', function(req, res) {
	res.send(markov.teaserGen.gen());
})

app.get('/geninfo', function(req, res) {
	res.send(markov.infoGen.gen());
})

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.get('/index.css', function (req, res) {
  res.sendFile(__dirname + '/index.css');
});

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});