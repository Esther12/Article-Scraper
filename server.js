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






//Connecting to MongoDB
mongoose.connect(process.env.PORT || "mongodb://user:ro0tro0t@ds355357.mlab.com:55357/heroku_cs6dl5ll",{ useNewUrlParser: true });



console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from NYT's web board:" +
            "\n***********************************\n");

app.get("/scrape", async (req, res,next) => {
    axios.get("https://www.nytimes.com/section/politics").then(function(response){
        var $ = cheerio.load(response.data);
        
        var results = {};
            try{

           
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
                } catch(err){
                    next(err);
                }
        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", async (req, res,next) =>  {
    // Grab every document in the Articles collection
    try{
            db.Article.find({})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    }catch(err){
        next(err);
    }
  });


app.post("/addNotes",async (req, res,next) => {
    try{
        db.Note.create(req.body)
        .then(function(dbNote) {
            // View the added result in the console
            console.log(dbNote);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        });
    }catch(err){
        next(err);
    }
});

app.get("/getNote/:id",async (req, res,next) => {
    try{
            console.log("note articles : ",req.params.id)
            db.Note.find({ articles : req.params.id})
            .populate("Articles")
            .then(function(dbNote) {
                // If we were able to successfully find Articles, send them back to the client
                console.log("get note",dbNote);
                res.json(dbNote);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
        }catch(err){
            next(err);
        }
});

app.get("/delete/:id", async (req, res,next) => {
    try{
        // Remove a note using the objectID
        db.Note.findByIdAndRemove(
        req.params.id
        ,
        function(error, removed) {
            // Log any errors from mongojs
            if (error) {
            console.log(error);
            res.send(error);
            }
            else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(removed);
            res.send(removed);
            }
        }).then(function(dbNote) {
            // View the added result in the console
            console.log(dbNote);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        });
    }catch(err){
        next(err);
    }
  });


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });