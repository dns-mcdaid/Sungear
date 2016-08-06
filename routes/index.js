var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

const dataTest = require('../public/javascripts/test/dataTest');
const VisGene = require('../lib/visGene');

/* GET home page. */
router.get('/', function(req, res, next) {
    var args = [ "--version", "-data_dir", "data/" ];
    // VisGene.main(args, function(response){
        res.render('index', { title: 'Sungear' });
    // });
});

router.get('/items', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/sungear';
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Unable to connect.");
            console.log(err);
        } else {
            console.log("Connection established.");

            var collection = db.collection('items');

            collection.find({}).toArray(function(err, result) {
                if (err) {
                    res.send("we messed up.");
                } else if (result.length) {
                    res.render('itemsList', { 'itemsList' : result });
                } else {
                    res.send("No documents found.");
                }

                db.close();
            });
        }
    })
});

router.get('/upload', function(req, res) {
    res.render('upload', {title: 'Upload to SunGear'});
});

router.post('/addExperiment', function(req, res) {
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/sungear'
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
        } else {
            console.log("Uploading...");

            var collection = db.collection('experiments');
            // TODO: Include this.
        }
    });
});

module.exports = router;