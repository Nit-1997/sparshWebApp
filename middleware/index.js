var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments");

var middlewareobj ={};

middlewareobj.checkCampgroundOwnership=function (req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
          if(err||!foundCampground){
              req.flash("error","campground does not exist");
              res.redirect("back");
          }else{
              if(foundCampground.author.id.equals(req.user._id)){
                  next();
              }
              else{
                  req.flash("error","You don't have the permission to do that!!");
                  res.redirect("back");
              }
          }
    });         
  }else{
    req.flash("error","You need to be logged in to do that!!!");
     res.redirect("back");
    }   
}

middlewareobj.checkCommentOwnership = function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
          if(err || !foundComment){
              req.flash("error","Comment not found");
              res.redirect("back");
          }else{
              if(foundComment.author.id.equals(req.user._id)){
                  next();
              }
              else{
                  req.flash("error","You don't have the permission to do that!!");
                  res.redirect("back");
              }
          }
    });         
  }else{
     res.redirect("back");
     req.flash("error","You need to be logged in to do that!!");
    }   
}

middlewareobj.isLoggedIn=function(req,res,next){
     if(req.isAuthenticated()){
          return next();
     }
     req.flash("error","You need to login first!!");
     res.redirect("/login");
}


module.exports = middlewareobj;