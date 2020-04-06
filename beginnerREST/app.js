var express = require("express");
var db = require("./db") //require grabs the "db.js" file in the same directory as app.js and includes it
var app = express();
module.exports = app; //makes the object "app" visibile to the rest of the program
app.get("/tasks", function(req, res){
    res.send("Here are your tasks!");
});

