
//required models being included           

var mongoose    = require("mongoose");
var Comment    = require("./models/comments");
var Campground = require("./models/campgrounds");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

//function to be used in app.js
function seedDB(){
    Campground.remove({},function(err){  //callbacks used fr error handling and all campgrounds being removed from db
           if(err){
               console.log(err);
           }
           else{
               console.log("Removed campgrounds");
            // creating new campgrounds from the seed data and adding that to the db
                for(var i=0;i<data.length;i++){
                    Campground.create(data[i],function(err,campground){ //we make the callback in which we model a new campground 
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("campground added");
                            //create a commment
                             Comment.create(   { text:"blah blah...",  //object of comment and a callback function which has the error and the modelled comment
                                                 author:"nitin"       },
                                                function(err , comment){
                                                     if(err){
                                                         console.log(err);
                                                     }
                                                     else{
                                                         campground.comments.push(comment);
                                                         campground.save();
                                                         console.log("Created new comment");
                                                     }
                                               });
                        }
                    });
                }
           }
    });
}

module.exports = seedDB;
           