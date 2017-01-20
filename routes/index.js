const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

const VisGene = require('../lib/visGene');
const SortedSet = require('collections/sorted-set');
// require('../public/javascripts/test/HyperGeoTest').test();
/* GET home page. */
router.get('/', function(req, res, next) {
    var args = [ "--version", "-data_dir", "data/" ];

    //NOTE: This data is correct, but for Hypergeo to work properly, the "Total" attrbute must be available to the data.
    //See: public/javascripts/genes/Term.js line 233 for Hypergeo usage, and test/HyperGeoTest for an outline of how the probability is calculated using Hypergeo.
    var testing = {
        base : "./",
        dataDir : "data/",
        dataU : "data/",
        exp : {
            exp : [
                {
                    attrib : null,
                    desc : "Analysis of different regions of interest of ",
                    filename : "sungearFig2_v2",//Don't know what this stuff does
                    id : "sungearFigure2",
                    species : "ROI"
                }
            ]
        },
        src : {
            reader : {
                anchors : [
                    {"name": "sound"},
                    {"name": "odorAAirpuff"},
                    {"name": "odorB"},
                    {"name": "odorA"},
                    {"name": "odorASound"},
                    {"name": "airpuff"},
                    {"name": "airpuffSound"}
                ],
                expSets : {
                    "sound": ["4", "10", "16", "18", "22", "24", "35", "36", "39", "48", "51", "68", "74", "77", "84", "101", "104", "107", "108", "118", "121", "125", "128", "129", "131", "134", "138", "142", "143", "166", "167", "172", "181", "183", "190", "196"],
                    "odorAAirpuff": ["12", "13", "17", "18", "21", "24", "28", "31", "32", "38", "40", "43", "46", "49", "54", "55", "56", "60", "64", "66", "72", "73", "74", "76", "85", "90", "93", "96", "102", "104", "107", "109", "110", "111", "121", "124", "128", "133", "134", "135", "138", "139", "144", "145", "147", "148", "152", "153", "157", "158", "168", "169", "170", "174", "176", "182", "185", "199", "200"],
                    "odorB": ["7", "16", "22", "23", "24", "27", "33", "34", "36", "45", "49", "53", "63", "66", "96", "119", "124", "128", "130", "134", "139", "143", "145", "153", "160", "165", "167", "171", "173", "174", "176", "183", "184", "188", "191", "192", "198"],
                    "odorA": ["2", "3", "6", "11", "12", "15", "16", "17", "18", "21", "24", "28", "29", "30", "31", "32", "34", "35", "37", "38", "39", "40", "41", "43", "47", "49", "51", "52", "55", "56", "65", "69", "70", "71", "73", "74", "76", "80", "82", "83", "85", "88", "89", "93", "94", "95", "96", "101", "103", "104", "106", "110", "112", "120", "124", "127", "131", "133", "135", "141", "144", "151", "152", "156", "157", "158", "161", "163", "165", "166", "169", "172", "173", "174", "176", "184", "188", "194", "195", "198", "199", "200"],
                    "odorASound": ["3", "4", "5", "8", "11", "13", "17", "18", "24", "27", "28", "29", "32", "35", "38", "40", "42", "43", "46", "54", "55", "56", "60", "63", "66", "69", "70", "72", "73", "76", "78", "80", "82", "83", "85", "89", "93", "94", "96", "97", "98", "101", "103", "109", "110", "113", "121", "124", "127", "131", "133", "134", "139", "144", "147", "148", "150", "151", "152", "156", "157", "158", "161", "162", "168", "170", "172", "174", "176", "180", "181", "182", "185", "188", "191", "194", "197", "198", "199", "200"],
                    "airpuff": ["2", "5", "6", "8", "9", "11", "12", "13", "14", "15", "16", "17", "18", "21", "23", "24", "27", "28", "29", "30", "31", "33", "34", "35", "37", "38", "40", "41", "42", "43", "46", "47", "49", "55", "56", "58", "66", "70", "71", "73", "74", "76", "78", "80", "82", "85", "88", "89", "92", "93", "94", "96", "101", "104", "106", "109", "117", "120", "121", "124", "127", "128", "134", "135", "137", "139", "141", "144", "147", "152", "153", "154", "155", "157", "158", "160", "161", "165", "166", "170", "171", "172", "174", "175", "176", "177", "180", "182", "188", "190", "194", "197", "198", "199", "200"],
                    "airpuffSound": ["2", "3", "5", "11", "14", "18", "23", "28", "30", "31", "33", "37", "38", "40", "43", "56", "65", "66", "70", "71", "73", "74", "76", "84", "86", "93", "106", "107", "124", "126", "131", "139", "145", "151", "152", "153", "154", "157", "164", "165", "174", "176", "178", "180", "183", "188", "194", "199"]},
                items : [
                    {"description": "ROI 1", "species": "ROI", "id": "1"},
                    {"description": "ROI 2", "species": "ROI", "id": "2"},
                    {"description": "ROI 3", "species": "ROI", "id": "3"},
                    {"description": "ROI 4", "species": "ROI", "id": "04"},
                    {"description": "ROI 5", "species": "ROI", "id": "5"},
                    {"description": "ROI 6", "species": "ROI", "id": "6"},
                    {"description": "ROI 7", "species": "ROI", "id": "7"},
                    {"description": "ROI 8", "species": "ROI", "id": "08"},
                    {"description": "ROI 9", "species": "ROI", "id": "9"},
                    {"description": "ROI 10", "species": "ROI", "id": "10"},
                    {"description": "ROI 11", "species": "ROI", "id": "11"}, {"description": "ROI 12", "species": "ROI", "id": "12"}, {"description": "ROI 13", "species": "ROI", "id": "13"}, {"description": "ROI 14", "species": "ROI", "id": "14"}, {"description": "ROI 15", "species": "ROI", "id": "15"}, {"description": "ROI 16", "species": "ROI", "id": "16"}, {"description": "ROI 17", "species": "ROI", "id": "17"}, {"description": "ROI 18", "species": "ROI", "id": "18"}, {"description": "ROI 19", "species": "ROI", "id": "19"}, {"description": "ROI 20", "species": "ROI", "id": "20"}, {"description": "ROI 21", "species": "ROI", "id": "21"}, {"description": "ROI 22", "species": "ROI", "id": "22"}, {"description": "ROI 23", "species": "ROI", "id": "23"}, {"description": "ROI 24", "species": "ROI", "id": "24"}, {"description": "ROI 25", "species": "ROI", "id": "25"}, {"description": "ROI 26", "species": "ROI", "id": "26"}, {"description": "ROI 27", "species": "ROI", "id": "27"}, {"description": "ROI 28", "species": "ROI", "id": "28"}, {"description": "ROI 29", "species": "ROI", "id": "29"}, {"description": "ROI 30", "species": "ROI", "id": "30"}, {"description": "ROI 31", "species": "ROI", "id": "31"}, {"description": "ROI 32", "species": "ROI", "id": "32"}, {"description": "ROI 33", "species": "ROI", "id": "33"}, {"description": "ROI 34", "species": "ROI", "id": "34"}, {"description": "ROI 35", "species": "ROI", "id": "35"}, {"description": "ROI 36", "species": "ROI", "id": "36"}, {"description": "ROI 37", "species": "ROI", "id": "37"}, {"description": "ROI 38", "species": "ROI", "id": "38"}, {"description": "ROI 39", "species": "ROI", "id": "39"}, {"description": "ROI 40", "species": "ROI", "id": "40"}, {"description": "ROI 41", "species": "ROI", "id": "41"}, {"description": "ROI 42", "species": "ROI", "id": "42"}, {"description": "ROI 43", "species": "ROI", "id": "43"}, {"description": "ROI 44", "species": "ROI", "id": "44"}, {"description": "ROI 45", "species": "ROI", "id": "45"}, {"description": "ROI 46", "species": "ROI", "id": "46"}, {"description": "ROI 47", "species": "ROI", "id": "47"}, {"description": "ROI 48", "species": "ROI", "id": "48"}, {"description": "ROI 49", "species": "ROI", "id": "49"}, {"description": "ROI 50", "species": "ROI", "id": "50"}, {"description": "ROI 51", "species": "ROI", "id": "51"}, {"description": "ROI 52", "species": "ROI", "id": "52"}, {"description": "ROI 53", "species": "ROI", "id": "53"}, {"description": "ROI 54", "species": "ROI", "id": "54"}, {"description": "ROI 55", "species": "ROI", "id": "55"}, {"description": "ROI 56", "species": "ROI", "id": "56"}, {"description": "ROI 57", "species": "ROI", "id": "57"}, {"description": "ROI 58", "species": "ROI", "id": "58"}, {"description": "ROI 59", "species": "ROI", "id": "59"}, {"description": "ROI 60", "species": "ROI", "id": "60"}, {"description": "ROI 61", "species": "ROI", "id": "61"}, {"description": "ROI 62", "species": "ROI", "id": "62"}, {"description": "ROI 63", "species": "ROI", "id": "63"}, {"description": "ROI 64", "species": "ROI", "id": "64"}, {"description": "ROI 65", "species": "ROI", "id": "65"}, {"description": "ROI 66", "species": "ROI", "id": "66"}, {"description": "ROI 67", "species": "ROI", "id": "67"}, {"description": "ROI 68", "species": "ROI", "id": "68"}, {"description": "ROI 69", "species": "ROI", "id": "69"}, {"description": "ROI 70", "species": "ROI", "id": "70"}, {"description": "ROI 71", "species": "ROI", "id": "71"}, {"description": "ROI 72", "species": "ROI", "id": "72"}, {"description": "ROI 73", "species": "ROI", "id": "73"}, {"description": "ROI 74", "species": "ROI", "id": "74"}, {"description": "ROI 75", "species": "ROI", "id": "75"}, {"description": "ROI 76", "species": "ROI", "id": "76"}, {"description": "ROI 77", "species": "ROI", "id": "77"}, {"description": "ROI 78", "species": "ROI", "id": "78"}, {"description": "ROI 79", "species": "ROI", "id": "79"}, {"description": "ROI 80", "species": "ROI", "id": "80"}, {"description": "ROI 81", "species": "ROI", "id": "81"}, {"description": "ROI 82", "species": "ROI", "id": "82"}, {"description": "ROI 83", "species": "ROI", "id": "83"}, {"description": "ROI 84", "species": "ROI", "id": "84"}, {"description": "ROI 85", "species": "ROI", "id": "85"}, {"description": "ROI 86", "species": "ROI", "id": "86"}, {"description": "ROI 87", "species": "ROI", "id": "87"}, {"description": "ROI 88", "species": "ROI", "id": "88"}, {"description": "ROI 89", "species": "ROI", "id": "89"}, {"description": "ROI 90", "species": "ROI", "id": "90"}, {"description": "ROI 91", "species": "ROI", "id": "91"}, {"description": "ROI 92", "species": "ROI", "id": "92"}, {"description": "ROI 93", "species": "ROI", "id": "93"}, {"description": "ROI 94", "species": "ROI", "id": "94"}, {"description": "ROI 95", "species": "ROI", "id": "95"}, {"description": "ROI 96", "species": "ROI", "id": "96"}, {"description": "ROI 97", "species": "ROI", "id": "97"}, {"description": "ROI 98", "species": "ROI", "id": "98"}, {"description": "ROI 99", "species": "ROI", "id": "99"}, {"description": "ROI 100", "species": "ROI", "id": "100"}, {"description": "ROI 101", "species": "ROI", "id": "101"}, {"description": "ROI 102", "species": "ROI", "id": "102"}, {"description": "ROI 103", "species": "ROI", "id": "103"}, {"description": "ROI 104", "species": "ROI", "id": "104"}, {"description": "ROI 105", "species": "ROI", "id": "105"}, {"description": "ROI 106", "species": "ROI", "id": "106"}, {"description": "ROI 107", "species": "ROI", "id": "107"}, {"description": "ROI 108", "species": "ROI", "id": "108"}, {"description": "ROI 109", "species": "ROI", "id": "109"}, {"description": "ROI 110", "species": "ROI", "id": "110"}, {"description": "ROI 111", "species": "ROI", "id": "111"}, {"description": "ROI 112", "species": "ROI", "id": "112"}, {"description": "ROI 113", "species": "ROI", "id": "113"}, {"description": "ROI 114", "species": "ROI", "id": "114"}, {"description": "ROI 115", "species": "ROI", "id": "115"}, {"description": "ROI 116", "species": "ROI", "id": "116"}, {"description": "ROI 117", "species": "ROI", "id": "117"}, {"description": "ROI 118", "species": "ROI", "id": "118"}, {"description": "ROI 119", "species": "ROI", "id": "119"}, {"description": "ROI 120", "species": "ROI", "id": "120"}, {"description": "ROI 121", "species": "ROI", "id": "121"}, {"description": "ROI 122", "species": "ROI", "id": "122"}, {"description": "ROI 123", "species": "ROI", "id": "123"}, {"description": "ROI 124", "species": "ROI", "id": "124"}, {"description": "ROI 125", "species": "ROI", "id": "125"}, {"description": "ROI 126", "species": "ROI", "id": "126"}, {"description": "ROI 127", "species": "ROI", "id": "127"}, {"description": "ROI 128", "species": "ROI", "id": "128"}, {"description": "ROI 129", "species": "ROI", "id": "129"}, {"description": "ROI 130", "species": "ROI", "id": "130"}, {"description": "ROI 131", "species": "ROI", "id": "131"}, {"description": "ROI 132", "species": "ROI", "id": "132"}, {"description": "ROI 133", "species": "ROI", "id": "133"}, {"description": "ROI 134", "species": "ROI", "id": "134"}, {"description": "ROI 135", "species": "ROI", "id": "135"}, {"description": "ROI 136", "species": "ROI", "id": "136"}, {"description": "ROI 137", "species": "ROI", "id": "137"}, {"description": "ROI 138", "species": "ROI", "id": "138"}, {"description": "ROI 139", "species": "ROI", "id": "139"}, {"description": "ROI 140", "species": "ROI", "id": "140"}, {"description": "ROI 141", "species": "ROI", "id": "141"}, {"description": "ROI 142", "species": "ROI", "id": "142"}, {"description": "ROI 143", "species": "ROI", "id": "143"}, {"description": "ROI 144", "species": "ROI", "id": "144"}, {"description": "ROI 145", "species": "ROI", "id": "145"}, {"description": "ROI 146", "species": "ROI", "id": "146"}, {"description": "ROI 147", "species": "ROI", "id": "147"}, {"description": "ROI 148", "species": "ROI", "id": "148"}, {"description": "ROI 149", "species": "ROI", "id": "149"}, {"description": "ROI 150", "species": "ROI", "id": "150"}, {"description": "ROI 151", "species": "ROI", "id": "151"}, {"description": "ROI 152", "species": "ROI", "id": "152"}, {"description": "ROI 153", "species": "ROI", "id": "153"}, {"description": "ROI 154", "species": "ROI", "id": "154"}, {"description": "ROI 155", "species": "ROI", "id": "155"}, {"description": "ROI 156", "species": "ROI", "id": "156"}, {"description": "ROI 157", "species": "ROI", "id": "157"}, {"description": "ROI 158", "species": "ROI", "id": "158"}, {"description": "ROI 159", "species": "ROI", "id": "159"}, {"description": "ROI 160", "species": "ROI", "id": "160"}, {"description": "ROI 161", "species": "ROI", "id": "161"}, {"description": "ROI 162", "species": "ROI", "id": "162"}, {"description": "ROI 163", "species": "ROI", "id": "163"}, {"description": "ROI 164", "species": "ROI", "id": "164"}, {"description": "ROI 165", "species": "ROI", "id": "165"}, {"description": "ROI 166", "species": "ROI", "id": "166"}, {"description": "ROI 167", "species": "ROI", "id": "167"}, {"description": "ROI 168", "species": "ROI", "id": "168"}, {"description": "ROI 169", "species": "ROI", "id": "169"}, {"description": "ROI 170", "species": "ROI", "id": "170"}, {"description": "ROI 171", "species": "ROI", "id": "171"}, {"description": "ROI 172", "species": "ROI", "id": "172"}, {"description": "ROI 173", "species": "ROI", "id": "173"}, {"description": "ROI 174", "species": "ROI", "id": "174"}, {"description": "ROI 175", "species": "ROI", "id": "175"}, {"description": "ROI 176", "species": "ROI", "id": "176"}, {"description": "ROI 177", "species": "ROI", "id": "177"}, {"description": "ROI 178", "species": "ROI", "id": "178"}, {"description": "ROI 179", "species": "ROI", "id": "179"}, {"description": "ROI 180", "species": "ROI", "id": "180"}, {"description": "ROI 181", "species": "ROI", "id": "181"}, {"description": "ROI 182", "species": "ROI", "id": "182"}, {"description": "ROI 183", "species": "ROI", "id": "183"}, {"description": "ROI 184", "species": "ROI", "id": "184"}, {"description": "ROI 185", "species": "ROI", "id": "185"}, {"description": "ROI 186", "species": "ROI", "id": "186"}, {"description": "ROI 187", "species": "ROI", "id": "187"}, {"description": "ROI 188", "species": "ROI", "id": "188"}, {"description": "ROI 189", "species": "ROI", "id": "189"}, {"description": "ROI 190", "species": "ROI", "id": "190"}, {"description": "ROI 191", "species": "ROI", "id": "191"}, {"description": "ROI 192", "species": "ROI", "id": "192"}, {"description": "ROI 193", "species": "ROI", "id": "193"}, {"description": "ROI 194", "species": "ROI", "id": "194"}, {"description": "ROI 195", "species": "ROI", "id": "195"}, {"description": "ROI 196", "species": "ROI", "id": "196"}, {"description": "ROI 197", "species": "ROI", "id": "197"}, {"description": "ROI 198", "species": "ROI", "id": "198"}, {"description": "ROI 199", "species": "ROI", "id": "199"}, {"description": "ROI 200", "species": "ROI", "id": "200"}],
                categories : []
            }
        }
    };
    /*
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
                        "p_t": 0.77419354835,
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
                        "p_t": 0.09677419354,
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
                        "p_t": 0.12903225806,
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
                        "p_t": 0.06451612903,
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
                        "p_t": 0.06451612903,
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
                        "p_t": 0.09677419354,
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
                        "p_t": 0.09677419354,
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
                        "p_t": 0.22580645161,
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
                        "p_t": 0.09677419354,
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
                        "p_t": 0.12903225806,
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
                        "p_t": 0.06451612903,
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
                        "p_t": 0.03225806451,
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
                        "p_t": 0.06451612903,
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
                        "p_t": 0.06451612903,
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
    */
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
