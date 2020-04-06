var app = require("./app");//includes our app file into this file
var port = process.env.PORT || 3000; //chooses a port or initializes port to 3000
var server = app.listen(port, function(){
    console.log("Server running on port " + port);
});