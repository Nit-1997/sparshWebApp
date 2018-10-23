var mongoose = require("mongoose");
var commentSchema =  mongoose.Schema({
      text   : String,
      createdAt: { type: Date, default: Date.now },
   
    //Associating comments and users      
      author :  {  //author has 2 properties id and a username
                   id:{
                         type:mongoose.Schema.Types.ObjectId,      //syntax to add id using mongodb
                         ref:"User"                                //model we are associating with
                      },
                   username:String   
                }
});

module.exports = mongoose.model("Comment",commentSchema);