var express   = require("express"); 
var router    = express.Router();
var User      = require("../models/user");
var passport  = require("passport");


//ROUTES

//ROOT ROUTE
router.get("/",function(req,res){
   res.render("home");  
});
//================================================================================
//AUTHENTICATION ROUTES
//================================================================================

//sign up route

//render the sign up form
router.get("/register",function(req,res){
    res.render("register"); 
});
//sign up logic
router.post("/register",function(req,res){
   var newUser = new User({username:req.body.username});
   //passport-local-mongoose method
   User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            //return is a simple way of short circuiting 
            return res.render("register",{"error": err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to yelpcamp "+user.username);
            res.redirect("/campgrounds");
        });
   });
}); 

//login routes

//render the login form
router.get("/login",function(req,res){
    res.render("login"); 
});
//login logic
router.post("/login",passport.authenticate("local",{ //==============
    successRedirect:"/campgrounds",               //MIDDLEWARE
    failureRedirect:"/login",                     //==============
    failureFlash: true,
    successFlash: 'Welcome to YelpCamp!'
}),function(req,res){
});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged you out!!");
    res.redirect("/campgrounds");
});


module.exports = router;