// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const serverless = require('serverless-http');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var router = express.Router();
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('/.netlify/functions/server', router);  // path must route to lambda

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date_string?", function(req,res) {

  const dateParam = req.params['date_string'];

  //date is empty
  if(dateParam === undefined) {
    const newDate = new Date();
    return res.json({"unix": newDate.getTime(), "utc": newDate.toUTCString()})
  }

  //date is invalid
  const date = Date.parse(dateParam);
  if(date === NaN) {
    res.json({"error": "Invalid Date"});
  }
  //date valid, lets return formatted object
  else {
    const parsedDate = new Date(dateParam);
    res.json({"unix": parsedDate.getTime(), "utc": parsedDate.toUTCString()})
  }

});

module.exports = app;
module.exports.handler = serverless(app);