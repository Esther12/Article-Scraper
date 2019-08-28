var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();

// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));





// Connecting to the mongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";

mongoose.connect("mongodb://localhost/nytscraper",{ useNewUrlParser: true });



console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from NYT's web board:" +
            "\n***********************************\n");

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/section/politics").then(function(response){
        var $ = cheerio.load(response.data);
        
        var results = {};

            $(".css-4jyr1y").each((i,element)=>{
                let title = $(element).find("h2").text();
                let link = $(element).find("a").attr("href");
                let discription = $(element).find(".css-1echdzn").text();   

                results.title = title;
                results.link = link;
                results.discription = discription;

                // Create a new Article using the `result` object built from scraping
                db.Article.create(results)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            
            });
        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });