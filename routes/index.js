const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

require('../public/javascripts/test/HyperGeoTest').test();
const VisGene = require('../lib/visGene');
const SortedSet = require('collections/sorted-set');

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
                    { name : "The Crownlands" },
                    { name : "The Iron Islands" },
                    { name : "The North" },
                    { name : "Essos" },
                    { name : "The Vale" },
                    { name : "Dorne" }
                ],
                expSets : {
                    "The Crownlands" : [
                        "eddardsta", "aryastark", "sansastar",
                        "catelynst", "jaimelann", "cerseilan",
                        "tyrionlan", "joffreyba", "littlefin",
                        "olennatyr", "macetyrel", "margaeryt",
                        "lorastyre", "viserysta", "rahegarta",
                        "tommenbar"
                    ],
                    "The North" : [
                        "eddardsta", "aryastark", "sansastar",
                        "catelynst", "jonsnow", "robbstark",
                        "brandonst", "rickonsta", "jaimelann",
                        "cerseilan", "tyrionlan", "joffreyba",
                        "theongrey", "roosebolt", "tommenbar",
                        "ramseybol"
                    ],
                    "Essos" : [
                        "daenaryst", "tyrionlan", "greyworm",
                        "jorahmorm", "aryastark", "theongrey",
                        "yaragreyj", "viserysta"
                    ],
                    "The Vale" : [
                        "littlefin", "catelynst", "tyrionlan",
                        "sansastar", "lysaarryn", "robinarry"
                    ],
                    "The Iron Islands" : [
                        "theongrey", "yaragreyj", "eurongrey"
                    ],
                    "Dorne" : [
                        "olennatyr", "jaimelann", "rahegarta"
                    ]
                },

                items : [
                    { id : 'greyworm', description : 'Grey Worm' },
                    { id : 'jorahmorm', description : 'Jorah Mormont' },
                    { id : 'daenaryst', description : 'Daenerys Targaryen' },
                    { id : 'joffreyba', description : 'Joffrey Baratheon' },
                    { id : 'tyrionlan', description : 'Tyrion Lannister' },
                    { id : 'cerseilan', description : 'Cersei Lannister' },
                    { id : 'jaimelann', description : 'Jaime Lannister' },
                    { id : 'aryastark', description : 'Arya Stark' },
                    { id : 'brandonst', description : 'Brandon Stark' },
                    { id : 'rickonsta', description : 'Rickon Stark' },
                    { id : 'sansastar', description : 'Sansa Stark' },
                    { id : 'jonsnow', description : 'Jon Snow' },
                    { id : 'robbstark', description : 'Robb Stark' },
                    { id : 'catelynst', description : 'Cateyln Stark' },
                    { id : 'eddardsta', description : 'Eddard Stark' },
                    { id : 'littlefin', description : 'Little Finger' },
                    { id : 'theongrey', description : 'Theon Greyjoy' },
                    { id : 'yaragreyj', description : 'Yara Greyjoy' },
                    { id : 'eurongrey', description : 'Euron Greyjoy' },
                    { id : "viserysta", description : 'Viserys Targaryen' },
                    { id : 'rahegarta', description : 'Rahegar Targaryen' },
                    { id : "olennatyr", description : 'Olenna Tyrell' },
                    { id : "macetyrel", description : 'Mace Tyrell' },
                    { id : "margaeryt", description : 'Margaery Tyrell' },
                    { id : "lorastyre", description : 'Loras Tyrell' },
                    { id : "roosebolt", description : "Roose Bolton" },
                    { id : "lysaarryn", description : "Lysa Arryn" },
                    { id : "robinarry", description : "Robin Arryn" },
                    { id : "ramseybol", description : "Ramsey Bolton" },
                    { id : "tommenbar", description : "Tommen Baratheon" },
                    { id : "walderfre", description : "Walder Frey" }
                ],
                categories : [
                    {
                        "id": "GOT:001",
	                    "description": "noble",
                        "zScore": 0.77419354835,
                        "items": [],
                        "parents": [],
                        "children": [
                            "GOT:004", "GOT:005",
                            "GOT:006", "GOT:007",
                            "GOT:008", "GOT:009",
                            "GOT:010"
                        ],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:002",
                        "description": "commoner",
                        "zScore": 0.09677419354,
                        "items": [],
                        "parents": [],
                        "children": [
                            "GOT:011", "GOT:012"
                        ],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:003",
                        "description": "bastard",
                        "zScore": 0.12903225806,
                        "items": [],
                        "parents": [],
                        "children": [
                        	"GOT:013", "GOT:014"
                        ],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:004",
                        "description": "arryn",
                        "zScore": 0.06451612903,
                        "items": [
                            "lysaarryn", "robinarry"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:005",
                        "description": "frey",
                        "zScore": 0.06451612903,
                        "items": [
                            "roosebolt", "walderfre"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:006",
                        "description": "greyjoy",
                        "zScore": 0.09677419354,
                        "items": [
                            "theongrey", "yaragreyj",
                            "eurongrey"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:007",
                        "description": "lannister",
                        "zScore": 0.09677419354,
                        "items": [
                            "jaimelann", "cerseilan",
                            "tyrionlan"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:008",
                        "description": "stark",
                        "zScore": 0.22580645161,
                        "items": [
                            'eddardsta', 'catelynst',
                            'aryastark', 'sansastar',
                            'robbstark', 'rickonsta',
                            'brandonst'
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:009",
                        "description": "targaryen",
                        "zScore": 0.09677419354,
                        "items": [
                            "daenaryst", "viserysta",
                            "rahegarta"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:010",
                        "description": "tyrell",
                        "zScore": 0.12903225806,
                        "items": [
                            "olennatyr", "macetyrel",
                            "margaeryt", "lorastyre"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:011",
                        "description": "westerosi",
                        "zScore": 0.06451612903,
                        "items": [
                            "littlefin",
	                        "jorahmorm"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:012",
                        "description": "essosi",
                        "zScore": 0.03225806451,
                        "items": [
                            "greyworm"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:013",
                        "description": "snow",
                        "zScore": 0.06451612903,
                        "items": [
                            "jonsnow", "ramseybol"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
                    },
                    {
                        "id": "GOT:014",
                        "description": "waters",
                        "zScore": 0.06451612903,
                        "items": [
                            "joffreyba", "tommenbar"
                        ],
                        "parents": [],
                        "children": [],
                        "species": "game of thrones"
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