const {MongoClient} = require('mongodb')//imports mongoDB to access atlas database
//To get the uri you have to go to MongoDB Atlas and click connect and follow the steps
const uri = "[KEY]" //holds the connection uri to our database
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});//creates an instance of our Mongo Client
module.exports = {//this declares that you want to expose this function for use in whatever code requires this file
    initDB: async function connector(){//creates asynchronous function called main
        try{//tries to do the following
            await client.connect(); //wait for the client to connect to our cluster before moving on
            console.log("Connected!");
        }
        catch (e){
            console.log(e);//otherwise print error to console
        }
        /*no need to close database connection until you kill the program
        finally{//this happens regardless of whether the try to catch occurs
            await client.close();//close the connection
        }
        */
    },
    addToDB: async function addPerson(newPerson){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newPerson);//inserts one BSON into our collection using MongoDB function "insertOne"
        console.log(`New listing created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
    },
    getDB: async function getPeople(){
        const cursor = await client.db("BeginnerProject").collection("BeginnerDB").find();
        const results = await cursor.toArray();
        return results;
    },
    updateDB: async function updatePerson(name, age){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").updateOne({'username':name},{'$set':{'password':password}});
        return `${result.modifiedCount}`;
    },
    deleteFromDB: async function deletePerson(name){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").deleteOne({'username':name});
        return `${result.deletedCount}`;
    }
};
//connector().catch(console.error);

/*
async function createPerson(client, newPerson){//creates a function that adds to database
    const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newPerson);//inserts one BSON into our collection using MongoDB function "insertOne"
    console.log(`New listing created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
}
await createPerson(client, //calls the above function after waiting for client to connect
    {//with the following as the data being inserted into the database as a BSON
        name: "Lovely Loft",
        summary: "A charming loft in Paris",
        bedrooms: 1,
        bathrooms: 1
    }
);
*/