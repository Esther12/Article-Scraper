var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3001;

var app = express();

// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
require("dotenv").config();

//Connecting to MongoDB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

console.log(
  "\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from NYT's web board:" +
    "\n***********************************\n" +
    process.env.MONGODB_URI
);

// A GET route for scraping the echoJS website
app.get("/scrape", async (req, res, next) => {
  // First, we grab the body of the html with axios
  let data1 = await axios
    .get("https://www.nytimes.com/section/politics")
    .catch(err => {
      console.error(err);
    });
  //console.log(data1.data);
  //res.send(data1.data);
  let $ = await cheerio.load(data1.data);
  let result = {};
  let Data = [];
  console.log("46--get in here!!!");
  $(".css-ye6x8s").each((i, element) => {
    console.log("49--get in here!!!");
    if (i < 10) {
      Data.push({
        title:
          `"` +
          $(element)
            .find("h2")
            .text() +
          `"`,
        link:
          "https://www.nytimes.com" +
          $(element)
            .find("a")
            .attr("href"),
        description: $(element)
          .find(".css-1echdzn")
          .text(),
        img: $(element)
          .find("figure")
          .attr("itemid")
      });
    }
  });
  console.log("printout", Data);
  // Create a new Article using the `result` object built from scraping
  db.Article.create(Data)
    .then(function(dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
    });

  // Send a message to the client
  res.send("Scrape Complete");
});

// Route for getting all Articles from the db
app.get("/articles", async (req, res, next) => {
  // Grab every document in the Articles collection
  try {
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  } catch (err) {
    next(err);
  }
});

app.post("/addNotes", async (req, res, next) => {
  try {
    db.Note.create(req.body)
      .then(function(dbNote) {
        // View the added result in the console
        console.log(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  } catch (err) {
    next(err);
  }
});

app.get("/getNote/:id", async (req, res, next) => {
  try {
    console.log("note articles : ", req.params.id);
    db.Note.find({ articles: req.params.id })
      .populate("Articles")
      .then(function(dbNote) {
        // If we were able to successfully find Articles, send them back to the client
        console.log("get note", dbNote);
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  } catch (err) {
    next(err);
  }
});

app.get("/delete/:id", async (req, res, next) => {
  try {
    // Remove a note using the objectID
    db.Note.findByIdAndRemove(req.params.id, function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    })
      .then(function(dbNote) {
        // View the added result in the console
        console.log(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  } catch (err) {
    next(err);
  }
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
