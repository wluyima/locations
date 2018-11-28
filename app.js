var express = require('express');
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');

var port = process.env.PORT || 3000;

var sequelize = new Sequelize('locations', 'root', 'developer', {
    dialect: 'mysql'
});
//var sequelize = new Sequelize('mysql://localhost:3306/locations');
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

var app = express();
var router = express.Router();
app.use(bodyParser.json());

const Location = sequelize.define('location', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        zipcode: {
            type: Sequelize.INTEGER,
            field: "zip_code"
        }
    }, {
        freezeTableName: true,
        underscored: true
    });

//Create the table
Location.sync();

app.get('/', function (req, res) {
    res.redirect("index.html");
});

router.route('').get(function(req, resp){
    Location.findAll().then((locations) => {
        resp.json(locations);
    });
});

router.route('/:id').get(function(req, resp){
    Location.findByPk(req.params.id).then((location) => {
        resp.json(location);
    });
});

router.route('').post(function(req, resp){
    //Or new Location(req.body).save().then(function(loc){});
    Location.create(req.body).then((location) => {
        resp.json(location);
    });
});

router.route('/:id').put(function(req, resp){
    Location.findByPk(req.params.id).then((location) => {
        location.address = req.body.address;
        location.city = req.body.city;
        location.state = req.body.state;
        location.zipcode = req.body.zipcode;
        location.save().then(() => {
            resp.json(location);
        });
    });
});

router.route('/:id').delete(function(req, resp){
    //Or location.destroy().then(function(){});
    //Or location.remove().then(function(){});
    Location.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        resp.status(204).end();
    });
});

app.use('/api/locations', router);

app.use(express.static('.'));
app.use(express.static('build'));

app.listen(port, function(){
    console.log('Running Locations API on port '+port);
});
