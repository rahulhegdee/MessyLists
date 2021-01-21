//Some of these, especially the features that are required, are imports. Look at terminal_instructions.txt for more info.
const express = require('express');//imports express.js
const bodyParser = require('body-parser');//imports body-parser
//var mongoose = require('mongoose'); //imports mongoose NOTE: Used for local computer MongoDB server
const db = require("./database");//Accesses our database connection file
const apiRoutes = require("./api-routes");//Accesses API router file that we created
const port = process.env.PORT || 8080;//Sets up server port
const {MongoClient} = require('mongodb');//imports mongodb to integrate MongoDB Atlas database
const jwt = require('jsonwebtoken');//imports JWT authentication to our API
const cors = require('cors');//imports cross-origin response resource sharing
const { deleteFromDB } = require('./database');
const { response } = require('express');
//var db = require("./db") //require grabs the "db.js" file in the same directory as app.js and includes it
const app = express();//initialize app
module.exports = app; //makes the object "app" visibile to the rest of the program
let whitelist = ['http://localhost:3000'];//whitelist of all the servers we are allowing to access our assets
let corsOptions = {
    origin: whitelist,//allows only the sites in our whitelist
    successStatus: 200
}
app.use(cors(corsOptions));//allows any server or site to access this content as long as they are in the whitelist

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
app.get("/accounts", verifyToken, async function(req, res){//create an async function so we can get the results from the database
    //calls the verifyToken function before running anything else to make sure we can go forward
    //we need to try...catch when we use await
    try{
        let accounts = await db.getDB();//wait for the database to return the people
        jwt.verify(req.token, '[KEY]', (err,authorizedData)=>{
            if(err){
                res.status(401).json({
                    'message':'Access Denied'
                })
            }
            else{
                res.status(200).json({
                    'message':'Access Granted',
                    authorizedData,
                    'Accounts':accounts//respond with a json of the database elements
                })
            }
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({"Error Status: ": e});
    }
});
function verifyToken(req,res,next){
    const bearer = req.headers['authorization'];
    if(typeof bearer != undefined){
        //let bearerToken = bearer.split(' ');
        //let token = bearerToken[1];
        req.token = bearer;
        next();//moves forward because we successfully found a token
    }
    else{
        res.status(401).json({
            'message':'Access Denied'
        })
    }
}
app.post("/users", function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let account = {'username':username, 'password':password};
    if(!username){
        res.status(404).send("Account could not be created");
    }
    else{
        db.addToDB(account);//call the database function to add account to db
        res.status(200).send("Account added successfully!");
    }
})
app.post('/usernames', async function(req,res){
    let alreadyExists = false;
    let username = req.body.username;
    try{
        let accounts = await db.getDB();
        for(acc of accounts){
            if(acc.username === username){
                alreadyExists = true;
                res.status(200).send(true);
                break;
            }
        }
        if(!alreadyExists){
            res.status(401).send(false);
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send("error");
    }

})
app.post("/account", async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    let userAuth = false;
    let accountID = 0;
    try{
        let accounts = await db.getDB();
        for(acc of accounts){
            if(acc.username == username){
                if(acc.password == password){
                    userAuth = true;
                    break;
                }
            }
            accountID++;
        }
    }
    catch(e){console.log(e);}

    if(userAuth){
        jwt.sign({//sign jwt asynchronously
            username: username,
            exp: Math.floor((Date.now()/1000)+3600),
            id: accountID,
            admin: false
        },'[KEY]', (err, token) => {
            if(token){
                res.status(200).json({
                    'message': 'verified',
                    token
                })
            }
            else{
                res.status(401).json({
                    'message':'unverified'
                })
            }
        });
    }
    else{
        res.status(401).json({
            'message':'unverified'
        })
    }
})
app.post("/userdelete", async function(req,res){
    let username = req.body.username;
    try{
        let deleteStatus = await db.deleteFromDB(username);
        if(deleteStatus == 0){
            res.status(404).send(username + " not found");
        }
        else{
            res.status(200).send("account deleted");
        }
    }
    catch(e){
        console.log(e); 
        res.status(500).send("error");
    }
    
})
app.patch("/friends/:name", async function(req,res){
    let name = req.params.name;
    let password = req.body.password;
    try{
        let updateStatus = await db.updateDB(name, password);
        if(updateStatus == 0){
            res.status(404).send(name + " not found");
        }
        else{
            res.status(200).send(name + " updated");
        }
    }
    catch(e){
        console.log(e); 
        res.status(500).send("error");
    }
})
app.delete("/friends/:name", async function(req,res){
    let name = req.params.name;
    try{
        let status = await db.deleteFromDB(name);
        if(status == 0){
            res.status(404).send(name + " was not found");
        }
        else{
            res.status(200).send(name + " was deleted");
        }
    }
    catch(e){
        console.log(e); 
        res.status(500).send("error");
    }
})
app.listen(port, function(){
    console.log("Running on port " + port);
})

