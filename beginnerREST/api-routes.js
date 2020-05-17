const router = require('express').Router(); //Initializes express router
router.get('/', function(req, res){//sets default get response
    res.json({
        status: "API is working",
        message: "Hello World!"
    })
})
module.exports = router;//exports API routes
