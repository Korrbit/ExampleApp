// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./app/Config');
var cors = require('cors');


mongoose.connect(config.DB,  function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.DB + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.DB);
  }
});

app = express();
app.use(serveStatic(__dirname + "/dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.options('*', cors());

// Create default port
var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

var userRoutes = require('./app/Routes');

//  Use routes defined in Route.js and prefix with user
app.use('/api', userRoutes);

/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
  //res.header('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + PORT)

    // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Pass to next layer of middleware
  next()
}); */

// Server index.html page when request to the root is made
app.get('/', function (req, res, next) {
  res.sendfile('./dist/index.html')
});
