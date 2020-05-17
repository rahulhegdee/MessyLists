//Creating the package.json file comes from "npm init"
//Creating the node modules comes from " npm install express --save"
//Express is a framework for Node.js
const express = require('express');//this variable calls the module "express" located in node_modules
const bodyParser = require('body-parser');//this calls the "body-parser" module located in node-modules
//Note that require gives us access to a module. We can also require other files if we want to include those with this one.
//If I have another file (called server.js) that I want to include, I can say require("./server.js")
const app = express();//the module "express" is actually a function to access specific tools 
//app is now the object we use to build our program
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var people = [];
app.get('/list', function(req,res){//this is a get request 
    //this is our function or method. 
    //In express, req,res means request,response
    res.json({'people':people});//print out all every person object withint our people list as a JSON

    res.end();
});
//if the request is "/" then send the statement "Hello World!"
//Otherwise, send "404 Not Found" if request is anything else

app.listen(3000,function(){//while the app stays open and listening to inputs
    console.log('First app listening on port 3000!');//prints in terminal
});
//listen starts a server and listens on port 3000 for connections
//The response to said connections is stated above

//Now when we write "node app.js" we can go to our browser and say "localhost:3000" and it will say "Hello World!";
app.post('/list', function(req, res){//this happens when there is a post request
    var name = req.body.name;//takes in element if the user put a "name" in the body 
    var age = req.body.age;//takes in element if user put an "age" in the body
    var person = {"name":name, "age":age};//creates a person object with the name and age sent through the body
    if(!name){//if no name was posted
        res.status(500).send("No name or age found.");//status is a quick way to summarize the servers response
    }
    else{//if a name was posted
        people.push(person);//pushes this object into the people array
        res.send("Successfully added Person.");//whenever doing a post or get or whatver else you must always send an output back
        //if you dont do a res.send or res.json or etc. then the computer will sit waiting for the end.
        //You can also just do res.end()
    }
})

app.get('/list/:id', function(req, res){//:id allows you to put in any id
    var id = req.params.id;//saves the id from the params (params meaning the url essentially)
    function findId(person){//function that takes in a person
        return person.name === id;//and if that person.name equals id then return that person
        // the three === means that it finds the exact same variable so "3" == 3 is true but "3" === 3 is false
    }
    var getId = people.find(findId);//goes through each person is the people array and runs the findId function
    //find((people) => people.name === id) does the same as function findId
    if(!getId){//if the id was not found
        res.status(500).send("Person not found.");//send an error 500 status stating that the person was not found
    }
    else{//if id was found
        res.json(getId);//output the json of that person within the people array
    }
})

app.delete('/list/:id', function(req, res){//this occurs with a delete request
    var id = req.params.id;//saves id from url in variable
    function findId (person){//same findId from get function
        return person.name === id;
    }
    var getId = people.find(findId);//contains the person if found in people array
    if(!getId){//if the id was not found
        res.status(500).send("Person not found.");//output this server status
    }
    else{//if id was found
        var idx = people.indexOf(getId);//find the index of the person
        people.splice(idx,1);//remove the element in people array at the index of the var idx and only delete the 1 element
        res.send("Person deleted.");//outputs that the person was deleted from the people array
    }
})

app.put('/list/:id', function(req,res){//this occcurs with the put request (essenitally both delete and post combined)
    var id = req.params.id;//saves the id in the parameter
    var name = req.body.name;//saves name if in body
    var age = req.body.age;//saves age if in body
    if(name){//if name was inputted
        function findId(person){//same as findId function in delete
            return person.name === id;
        }
        var getId = people.find(findId);//same as getId in delete
        if(!getId){//getId did not return a value in people array
            res.status(500).send("Could not find person.");
        }
        else{//if value was in people
            var idx = people.indexOf(getId);//find the index of the person within the people array
            people[idx] = {"name":name, "age": age};//replace that index with the new person
            res.send("Replace successful.");//output from server
        }
    }
    else{//if no name was put
        res.send("No name found.");//output from server
    }
})

app.patch('/list/:id', function(req, res){//this occurs with the patch request (modifying a person)
    var id = req.params.id;//saves the id from params
    var age = req.body.age;//saves if age found in body
    if(!age){//if age was not in body
        res.status(500).send("No age found.")//output this status from the server
    }
    else{//if age was in body
        function findId(person){//find if the id was in the people list
            return person.name === id;
        }
        var getId = people.find(findId);
        if(!getId){//if id was not found in people list
            res.status(500).send("Could not find person.");//output this status from the server
        }
        else{//if found in people
            var idx = people.indexOf(getId);//get the index of where the person is in the array
            people[idx].age = age;//change the person age variable to the new age
            res.send("Inputted new age.");//output from server
        }
    }
})