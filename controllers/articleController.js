var express = require("express");

var router = express.Router();

var cheerio = require("cheerio");
var request = require("request");

var db = require("../models");

router.get("/scrape", function(req, res) {
    request("http://www.espn.com/nfl", function(err, response, html) {
        //console.log(html);
        var $ = cheerio.load(html);

        var results = [];

        $("ul.headlineStack__list").each(function(i, element) {

           // console.log(element);
            var title = $(element).children("li").children("a").text();
            var link = $(element).children("li").children("a").attr("href");

            results.push({
                title: title,
                link: "www.espn.com" + link
            });
        });
        console.log(results);
        //res.render("index");
    });
   // console.log($);
});

router.get("/", function(req, res) {
    res.render("index");
});
module.exports = router