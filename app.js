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

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true})

//TODO

const articleSchema ={
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get(function(req,res){
  Article.find(function(err,foundarticles){
    if(!err){
      console.log(foundarticles)
      res.send(foundarticles)
    }else{
      console.log(err)
    }
      
  })
})
.post(function(req,res){
  
  //put this data into our db 
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
    
  });
  newArticle.save(function(err){
    if(!err){
      res.send("success")
    } else{
      res.send(err);
    }
  })
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("success")

    }else{
      res.send(err)
    }
  })
})

//request targting specific articles
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,result){
    if(result){
      res.send(result)
    }else{
      res.send("not found")
    }

  })

})
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("success")
      }
    }
  )
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("sucess")
      }else{
        res.send("not going through")
      }
    }

  )
})
.delete(function(req,res){
  Ariticle.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(err){
        res.send("not going through")

      }else{
        res.send("success")
      }
      
    }

  )
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});