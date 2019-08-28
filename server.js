var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var express = require("express");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);



console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from NYT's web board:" +
            "\n***********************************\n");

axios.get("https://www.nytimes.com/section/politics").then(function(res){
    var $ = cheerio.load(res.data);
    
    var results = [];

    $(".css-4jyr1y").each((i,element)=>{
        var title = $(element).find("h2").text();
        var link = $(element).find("a").attr("href");
        var discription = $(element).find("p").text();   

        results.push({
            title : title,
            link : "https://www.nytimes.com" + link,
            discription : discription
        });

     });

     console.log(results);

})