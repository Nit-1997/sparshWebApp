var express = require("express"); 
var router  = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");
var geocoder = require("geocoder");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dskmn0vwa', 
  api_key:"943622486141547", 
  api_secret:"klX-ayutXqmxdZUmtL9bXhTQbro"
});

//INDEX ROUTE
router.get("/",function(req,res){
    Campground.find({},function(err,allCamps){
            if(err){
                console.log(err);
            } 
            else{
              res.render("campgrounds/index",{campgrounds:allCamps});         
            }
    });
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
     res.render("campgrounds/new"); 
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
      var name  = req.body.name;
      var image = req.body.image;
      var price = req.body.price;
      var desc  = req.body.description;
      var author = {
                       id       :req.user._id,
                       username :req.user.username
                   }
        //===============copied from google api========================           
         geocoder.geocode(req.body.location, function (err, data) {
            
      //================================================================
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                var location = data.results[0].formatted_address;                   
       //===============================================================
                              
                            cloudinary.uploader.upload(req.file.path, function(result) {
                                // add cloudinary url for the image to the campground object under image property
                                image = result.secure_url;
                            
                           
                              var newcamp =  {
                                                name        :name,
                                                image       :image,
                                                price       :price,
                                                description :desc,
                                                author      :author,
                                                //google api params
                                                location    :location,
                                                lat         :lat, 
                                                lng         :lng
                                             };                   
                           Campground.create(newcamp, function(err, newlyCreated) {
                                  if (err) {
                                    req.flash('error', err.message);
                                    return res.redirect('back');
                                  }else{
                                      //redirect back to campgrounds page
                                      //Logs Error
                                      console.log(newlyCreated);
                                      //Redirects Back To Featured Campgrounds Page
                                      res.redirect("/campgrounds");
                                  }
                                });
                              });                    
                         
          });
    });
        
        //SHOW ROUTE
        router.get("/:id",function(req,res){
               Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
                    if(err || !foundCampground){
                        console.log(err);
                        req.flash("error","campground not found");
                        res.redirect("/campgrounds");
                    } 
                    else{
                        res.render("campgrounds/show",{campground:foundCampground});     
                    }
               });
        });
        
        //EDIT ROUTE
        router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
            Campground.findById(req.params.id,function(err,foundCampground){
                       //foundCampground sent under the name of campground to the edit template
                       res.render("campgrounds/edit",{campground:foundCampground});          
    });
});
//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,{$set: newData},function(err,updatedCampground){
         if(err){
             res.redirect("/campgrounds");
         }else{
             req.flash("success","Campground updated successfully!!");
             res.redirect("/campgrounds/"+req.params.id);
         }
    });
  });    
})

//DELETE ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
          if(err){
              res.redirect("/campgrounds");
          }else{
              req.flash("success","Campground deleted successfully!!");
              res.redirect("/campgrounds");
          } 
    }); 
});




module.exports = router;