var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send("Welcome to the locations API");
});

app.listen(port, function(){
    console.log('Running API on port '+port);
});
