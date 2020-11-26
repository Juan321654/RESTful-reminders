const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
//this is for the view folder where the ejs will be used eg: home.ejs
app.set('view engine', 'ejs');
//bodyparser  used to do req.body etc
app.use(bodyParser.urlencoded({
  extended: true
}));
//this is for the public folder like pictures, and css styles
app.use(express.static("public"));
//wikiDB was created with 3T. 
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
//name the Schema whatever you want
const articleSchema = {
  title: String,
  content: String
};
//make sure to write it in a singular form, not plural, as mongoose will make it plural
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// //------------------------Get API info -------------------------------
// app.get("/articles", function(req, res){
//   //by leaving the condition empty before the function it will fetch all the articles, not just a specific one,
//   //for example Article.find({id: 1} function(err, foundArticles))
//   Article.find(function(err, foundArticles){
//     // console.log(foundArticles);
//     if (!err) {
//       res.send(foundArticles)
//     } else {
//       res.send(err)
//     }
//   })
// })

// // --------------------------POST -------------------------------------
// //make sure nodeman app.js is running and mongod(server) in terminals
// //in PostMan check localhost:3000/articles (POST) change to "Body" and select x-www-form-urlencoded option
// //in the "Key" "Value" add what the schema asks for built before
// //in this case title and content
// //after consoling out and see if it works in the terminal, then you can create the data for mongodb
// //with the const <constName> = new <ModelName> ({<fieldName : <fieldData}) 
// //then save it to actually save it on the database
// app.post("/articles", (req, res) => {
//   // console.log(req.body.title); 
//   // console.log(req.body.content); 

//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   })

//   newArticle.save(function(err){
//     if(!err){
//       res.send("successfully added a new article");
//     } else {
//       res.send(err)
//     }
//   });
// })

// //----------------------------------Delete ------------------------------
// //Article.deleteMany({_id: 1}, function(err){}) will delete the condition inside the 1st object
// //if we leave it empty and skip it to the function, it will delete all the data from the database
// //which it is what we are doin in the following code.
// //use postman to check that it works
// app.delete('/articles', function(req, res){
//   //by leaving the condition empty before the function it will fetch all the articles, not just a specific one,
//   //for example Article.find({id: 1} function(err, foundArticles))
//   Article.find(function(err, foundArticles){
//     // console.log(foundArticles);
//     if (!err) {
//       res.send(foundArticles)
//     } else {
//       res.send(err)
//     }
//   })
// })