var mongoose    = require("mongoose");
var campgroundSchema = new mongoose.Schema({
     name       : String,
     image      : String,
     price      : String,
     description: String,
     location   : String,
     lat        : Number,
     lng        : Number,
     createdAt  : { type: Date, default: Date.now },
     comments   : [
                     {
                          type : mongoose.Schema.Types.ObjectId,
                          ref  : "Comment"
                     }
                  ],
    //Associating campgrounds and users      
      author :  {  //author has 2 properties id and a username
                   id:{
                         type:mongoose.Schema.Types.ObjectId,      //syntax to add id using mongodb
                         ref:"User"                                //model we are associating with
                      },
                   username:String   
                }                  
});

module.exports = mongoose.model("Campground",campgroundSchema);