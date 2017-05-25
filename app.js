/**
  Module dependencies.
 */
var express = require("express"), // make var for required module
    // routes = require('./routes'),
    //load customers route
    // person = require('./route/index'),
    http = require('https'),
  //  path = require('path'),
    fs = require('fs');
var app = express(); // for creating server

// app.set('port', process.env.PORT || 9000);
// app.use(express.json());
// app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('env', 'dev');

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/index.html', function (req, res) {
   //console.log("Got a GET request for /list_user");
   res.send('index.html');
});
// app.get('/restApi', person.regiApi);// ------------- get ()
// app.post('/restApi', person.regiApi);// ------------ post()
var port= 8000;

var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});
