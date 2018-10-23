var express = require("express"); 
var router  = express.Router();
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments");
var middleware = require("../middleware");

//======================================================================================
//COMMENTS ROUTES
//======================================================================================

router.get("/new",middleware.isLoggedIn,function(req,res){
     Campground.findById(req.params.id,function(err,campground){
          if(err||!campground){
              console.log(err);
              req.flash("error","campground does not exist");
              res.redirect("/campgrounds");
          } 
          else{
              res.render("comments/new",{campground:campground});
          }
     }); 
});

router.post("/",middleware.isLoggedIn,function(req,res){
     Campground.findById(req.params.id,function(err,campground){
          if(err||!campground){
              console.log(err);
              req.flash("error","campground does not exist");
              res.redirect("/campgrounds");
          }
          else{
              Comment.create(req.body.comment,function(err,comment){
                    if(err||!comment){
                         req.flash("error","invalid URL tried to access");
                         res.redirect("/campgrounds/"+campground._id);
                    }
                    else{
                      //add username and id to a comment
                       comment.author.id       = req.user._id;
                       comment.author.username = req.user.username;
                       comment.save();
                       campground.comments.push(comment);
                       campground.save();
                       req.flash("success","Comment added successfully!!");
                       res.redirect("/campgrounds/"+campground._id);
                    }
              });
          }
     }); 
});

//Edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
     Campground.findById(req.params.id,function(err,foundCampground){
          if(err||!foundCampground){
              req.flash("error","campground does not exist");
              return res.redirect("back");
          }
           Comment.findById(req.params.comment_id,function(err,comment){
         if(err){
              req.flash("error",err.message);
              res.redirect("back");
          }else{
             res.render("comments/edit",{campground_id:req.params.id,comment:comment});
          }         
     });
  });
});

//update comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
         if(err){
              req.flash("error",err.message);
             res.redirect("back");
         }else{
              req.flash("success","Comment updated successfully!!");
             res.redirect("/campgrounds/"+req.params.id);
         } 
    }); 
});

//delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
          if(err){
               req.flash("error",err.message);
              res.redirect("back");
          }else{
              req.flash("success","Comment deleted successfully!!");
              res.redirect("/campgrounds/"+req.params.id);
          } 
    }); 
});


module.exports = router;