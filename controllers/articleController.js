var express = require("express");

var router = express.Router();

var cheerio = require("cheerio");
var request = require("request");

var db = require("../models");

router.get("/scrape", function(req, res) {
    request("http://www.espn.com/nfl", function(err, response, html) {
        //console.log(html);
        var $ = cheerio.load(html);

        var results = {};

        $("ul.headlineStack__list").each(function(i, element) {

           // console.log(element);
            results.title = $(this)
            .children("li")
            .children("a")
            .text();
            results.link = $(this)
            .children("li")
            .children("a")
            .attr("href");
            
            db.Article.create(results).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                return res.json(err);
            });
        });
        console.log(results);
        res.send("scrape complete");
    });
});

//router.get("/", function(req, res) {
    //res.render("index");
//});

router.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
           // res.render("index", {
             //   article: dbArticle 
           // });
           res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(dbArticle) {
        //res.render("index", dbArticle);
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
    db.Comments.create(req.body)
        .then(function(dbComments) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComments._id }, { new: true });
        })
        .then(function(dbArticle) {
           // res.render("index", dbArticle);
           res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});



module.exports = router