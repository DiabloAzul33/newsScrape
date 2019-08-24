const express = require("express");

const mongoose = require("mongoose");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");
// Set Handlebars.
var exphbs = require("express-handlebars");

const app = express();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

mongoose.connect(MONGODB_URI);

var Post = require("./models/Post")
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/api/scrape", function(req, res) {

    // First, tell the console what server.js is doing
    console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from reddit's Animals Being Bros board:" +
    "\n***********************************\n");
    
    // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
    axios.get("https://old.reddit.com/r/AnimalsBeingBros/").then(function(response) {
        
        // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("p.title").each(function(i, element) {
      
      // Save the text of the element in a "title" variable
    var title = $(element).text();
    
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");
    
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
        title: title,
        link: link
    });
});

// Log the results once you've looped through each of the elements found with cheerio
console.log(results);
for (var i = 0; i < results.length; i++) {
    Post.create(results[i])
    .then(function(dbPost) {
      // View the added result in the console
      console.log(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
    });

}
});
});
app.get("/api/posts", function(req,res) {
    Post.find({}, function(err, data) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }
        else {
          // Otherwise, send the result of this query to the browser
          res.json(data);
        }
      });
});

app.get("/", function(req, res) {
    Post.find({}, function(err, data) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }
        else {
          // Otherwise, send the result of this query to the browser
          res.render("index", {posts : data});
        }
      });
});

app.get("/bookmarked", function(req, res) {
  Post.find({bookmarked: true}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      else {
        // Otherwise, send the result of this query to the browser
        res.render("index", {posts : data});
      }
    });
});

app.put("/api/bookmarked", function(req, res) {
    console.log(req.body);
    var id = req.body.id;
    Post.findByIdAndUpdate({_id: id}, {bookmarked: true})
    .then(function(dbPost) {
      res.json(dbPost);
    }) 
    .catch(function(err) {
      res.json(err);
    });
});
app.listen(8000, function() {
    console.log("App is listening on Port 8000");
});