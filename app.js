//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


// Connection URL and create database 
const url = 'mongodb://localhost:27017/wikiDB';
mongoose.connect(url)


// Schema For collection
const articleSchema = new mongoose.Schema({
    title:String,
    content:String,
  });


  // Collection
const Article = mongoose.model("Article", articleSchema);


// ** Chained route: GET POST DELETE **
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,result){
        if(!err){
            res.send(result);
            // console.log(result)
        }
        else{
            res.send(err)
        }
    })
})
.post(function(req,res){
    // console.log(req.body.title)
    // console.log(req.body.content)

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("Article added successfully")
        }
        else{
            res.send(err)
        }
    })
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
        res.send("All articles deleted successfully")
        }
        else{
            res.send(err)
        }
    })
})


// ** Chained route: GET, PUT, PATCH, DELETE A SPECIFIC ARTICLE **
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,result){
        if(result){
            res.send(result);
            // console.log(result)
        }
        else{
            res.send("No article found matching that title")
        }
    })
})
.put(function (req, res) {
    // console.log(req.params.articleTitle);
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      {overwrite: true},
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    // console.log(req.params.articleTitle);
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      {$set: req.body},
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function (err) {
        if (!err) {
          res.send("Successfully deleted the article.");
        } else {
          res.send(err);
        }
      }
    )
  })






app.listen(3000, function() {
  console.log("Server started on port 3000");
});