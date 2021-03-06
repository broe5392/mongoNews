var express = require("express");
var xphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
//var cheerio = require("cheerio");
//var request = require("request");
var logger = require("morgan");
//var db = require("./models");

var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local espnHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/espnHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var app = express();

app.use(logger("dev"));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", xphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/articleController.js");
app.use(routes);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });