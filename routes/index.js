var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

const dataTest = require('../public/javascripts/test/dataTest');
// require('../public/javascripts/test/HyperGeoTest').test();
const VisGene = require('../lib/visGene');

/* GET home page. */
router.get('/', function(req, res, next) {
    var args = [ "--version", "-data_dir", "data/" ];
    var testing = {
        base : "./",
        dataDir : "data/",
        dataU : "data/",
        exp : {
            exp : [
                {
                    attrib : null,
                    desc : "Comparison of data from different laboratories (N and CN treatments)",
                    filename : "sungearFig2_v2",
                    id : "sungearFigure2",
                    species : "Arabidopsis thaliana columbia tair10"
                },
                {
                    attrib : null,
                    desc : "2004 MLB statistics",
                    filename : "batting2004.txt",
                    id : "MLB2004",
                    species : "MLB"
                }
            ]
        },
        src : {
            reader : {
                anchors : [
                    { name : "John" },
                    { name : "Paul" },
                    { name : "George" },
                    { name : "Ringo" }
                ],
                expSets : {
                    John : [
                        "revolutio",
                        "acrossthe",
                        "strawberr",
                        "adayinthe",
                        "iwanttoho",
                        "iwantyous",
                        "goodnight",
                        "whatgoeso"
                    ],
                    Paul : [
                        "adayinthe",
                        "pennylane",
                        "whydontwe",
                        "iwanttoho",
                        "i_will_68",
                        "letitbe69",
                        "whatgoeso"
                    ],
                    George : [
                        "herecomes",
                        "savoytruf",
                        "piggies68",
                        "something"
                    ],
                    Ringo : [
                        "octopusga",
                        "goodnight",
                        "whatgoeso"
                    ]
                },
                items : [
                    {
                        id : "iwantyous",
                        description : "I Want You (She's So Heavy)"
                    },
                    {
                        id : "iwanttoho",
                        description : "I Want to Hold Your Hand"
                    },
                    {
                        id : "i_will_68",
                        description : "I Will"
                    },
                    {
                        id : "letitbe69",
                        description : "Let it Be"
                    },
                    {
                        id : "piggies68",
                        description : "Piggies"
                    },
                    {
                        id : "whatgoeso",
                        description : "What Goes On"
                    },
                    {
                        id : "goodnight",
                        description : "Good Night"
                    },
                    {
                        id : "revolutio",
                        description : "Revolution 9"
                    },
                    {
                        id : "acrossthe",
                        description : "Across the Universe"
                    },
                    {
                        id : "strawberr",
                        description : "Strawberry Fields Forever"
                    },
                    {
                        id : "adayinthe",
                        description : "A Day in the Life"
                    },
                    {
                        id : "pennylane",
                        description : "Penny Lane"
                    },
                    {
                        id : "whydontwe",
                        description : "Why Don't we do it in the Road?"
                    },
                    {
                        id : "herecomes",
                        description : "Here Comes the Sun"
                    },
                    {
                        id : "savoytruf",
                        description : "Savoy Truffle"
                    },
                    {
                        id : "octopusga",
                        description : "Octopus's Garden"
                    }
                ]
            }
        }
    };

    // VisGene.main(args, function(response){
    //     res.render('index', { title: 'Sungear', data: response});
    // });
    res.render('index', { title: 'Sungear', data: testing});
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