//APP CONFIG
var  express        = require("express")
   , app            = express()
   , bodyParser     = require("body-parser")
   , mongoose       = require("mongoose")
   , passport       = require("passport")
   , flash          = require("connect-flash") 
   , methodOverride = require("method-override")
   , LocalStrategy  = require("passport-local")
   , Campground     = require("./models/campgrounds")
   , User           = require("./models/user")
   , Comment        = require("./models/comments")
   , seedDB         = require("./seeds");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost/yelpcampV13");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB(); seeds the database

//PASSPORT CONFIG
app.use(require("express-session")({
    secret            : "anything i want i can put here",
    resave            :  false,
    saveUninitialized :  false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    

//our own middleware to add current user to all the pages
app.use(function(req,res,next){
   res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();  //very imp as it is a middleware it requires next operation
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(7000,function(){
     console.log("YelpCamp server has started");
});