// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var router = express.Router();
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
router.get("/home", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
router.get("/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

router.get("/api/timestamp/:date_string?", function (req, res) {
  const dateParam = req.params["date_string"];

  //date is empty
  if (dateParam === undefined) {
    const newDate = new Date();
    return res.json({ unix: newDate.getTime(), utc: newDate.toUTCString() });
  }

  //check if number > 5 to pass as num, otherwise pass as string
  if (/\d{5,}/.test(dateParam)) {
    const parsedDate = new Date(parseInt(dateParam));
    res.json({ unix: dateParam, utc: parsedDate.toUTCString() });
  }
  //date is invalid
  else if (new Date(dateParam).toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  }
  //otherwise valid non-unix time
  else {
    const parsedDate = new Date(dateParam);
    res.json({ unix: parsedDate.getTime(), utc: parsedDate.toUTCString() });
  }
});

app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
