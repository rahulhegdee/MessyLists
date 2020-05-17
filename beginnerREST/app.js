//Some of these, especially the features that are required, are imports. Look at terminal_instructions.txt for more info.
const express = require('express');//imports express.js
const bodyParser = require('body-parser');//imports body-parser
//var mongoose = require('mongoose'); //imports mongoose NOTE: Used for local computer MongoDB server
const db = require("./database");//Accesses our database connection file
const apiRoutes = require("./api-routes");//Accesses API router file that we created
const port = process.env.PORT || 3000;//Sets up server port
const {MongoClient} = require('mongodb');//imports mongodb to integrate MongoDB Atlas database
//var db = require("./db") //require grabs the "db.js" file in the same directory as app.js and includes it
const app = express();//initialize app
module.exports = app; //makes the object "app" visibile to the rest of the program
app.use(bodyParser.urlencoded({//configures body parser to handle post requests
    extended: true
}))
app.use(bodyParser.json());
//The next two commented steps are for local MongoDB server running from local computer
//mongoose.connect('mongodb://localhost/beginnerrest', {useNewUrlParser: true, useUnifiedTopology: true});//connects to our new MongoDB database when we search for that link
//var db = mongoose.connection;//sets connection variable
//connection.connector().catch(console.error); //runs the main function in connection.js 
db.initDB();//this calls the exposed function from database.js
app.use('/api', apiRoutes);//Uses the routes we created in our app (accesses this files contents when we do get "/api")
app.get("/friends", async function(req, res){//create an async function so we can get the results from the database
    let people = await db.getDB();//wait for the database to return the people
    res.json({'people':people});//respond with a json of the database elements
});
app.post("/friends", function(req, res){
    let name = req.body.name;
    let age = req.body.age;
    let person = {'name':name, 'age':age};
    if(!name){
        res.send("Person could not be created");
    }
    else{
        db.addToDB(person);//call the database function to add person to db
        res.send("Person added successfully!");
    }
})
app.patch("/friends/:name", async function(req,res){
    let name = req.params.name;
    let age = req.body.age;
    let updateStatus = await db.updateDB(name, age);
    if(updateStatus == 0){
        res.send(name + " not found");
    }
    else{
        res.send(name + " updated");
    }
})
app.delete("/friends/:name", async function(req,res){
    let name = req.params.name;
    let status = await db.deleteFromDB(name);
    if(status == 0){
        res.send(name + " was not found");
    }
    else{
        res.send(name + " was deleted");
    }
})
app.listen(port, function(){
    console.log("Running on port " + port);
})

