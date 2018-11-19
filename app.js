var express = require('express');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var app = express();
var router = express.Router();
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Welcome to the locations API");
});

router.route('').get(function(req, resp){
    resp.json({list: 'This is the list of locations'});
});

router.route('/:id').get(function(req, resp){
    resp.json({list: 'Location with id: '+req.params.id});
});

router.route('').post(function(req, resp){
    resp.json({list: 'Creating location with data: '+req.body});
});

router.route('/:id').put(function(req, resp){
    resp.json({list: 'Updating location with id: '+req.params.id+', data = '+req.body});
});

router.route('/:id').delete(function(req, resp){
    resp.json({list: 'Deleting location with id: '+req.params.id});
});

app.use('/api/locations', router);

app.listen(port, function(){
    console.log('Running API on port '+port);
});
