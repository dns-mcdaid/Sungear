const fs = require('fs');
const jsonfile = require('jsonfile');

var itemFile = '/Users/dennismcdaid/WebstormProjects/Sungear/data/items.json';
var categoryFile = '/Users/dennismcdaid/WebstormProjects/Sungear/data/categories.json';
var experimentFile = '/Users/dennismcdaid/WebstormProjects/Sungear/data/experiment.json';

function Item(id, description, species) {
    this.id = id;
    this.description = description;
    this.species = species;
}

function Category(species) {
    this.id = null;
    this.description = null;
    this.zScore = null;
    this.items = [];
    this.parents = [];
    this.children = [];
    this.species = species;
}

function Experiment(species, name) {
    this.species = species;
    this.name = name;
    this.data = {};
}

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

if (process.argv.length < 3 ) {
    console.error("Sorry, I need a text file and a label to apply");
    return;
} else {
    var dataDir = "";
    var sungearU = null;
    var species = "";
    var sunMap = {};
    process.argv.forEach(function (val, index, array) {
        if (val == '--help') {
            console.log("\nTo run this app, run your command in the following format: ");
            console.log("\tdataDir=../data/ geneU=genes.txt etc...\n");
            console.log("These are the following files we need:");
            console.log("\tgeneU:\t\tThe file of all items in this species.");
            console.log("\tlistU:\t\tThe file of all categories with descriptions.");
            console.log("\thierU:\t\tThe file of all categories belonging to other categories.");
            console.log("\tassocU:\t\tThe file of all items belonging to these categories.");
            console.log("\tspecies:\tThe species you want to belong to these items and categories.");
            console.log("\tsungearU:\tThe set you specifically want analyzed.\n");
            return;
        }
        if (val.indexOf('=') > -1) {
            var combo = val.split('=');
            var title = combo[0].trim();
            var desc = combo[1].trim()
            if (title == 'dataDir') {
                dataDir = desc;
            } else if (title == 'sungearU') {
                sungearU = desc;
            } else if (title == 'species') {
                species = desc;
            } else {
                sunMap[title] = desc;
            }
        }
    });
    // if ((typeof sunMap['dataDir'] === 'undefined' && typeof sunMap['species'] === 'undefined') && typeof sunMap['sungearU'] === 'undefined') {
    //     console.error("ERROR: Need a data directory with species or a Sungear file.");
    //     return;
    // }
}

var items = [];
var categories = {};
var parsed;
var name;
var desc;
var toCat;
var children;
var catArr = [];
var lines;

var geneU = dataDir + sunMap['geneU'];
var listU = dataDir + sunMap['listU'];
var hierU = dataDir + sunMap['hierU'];
var assocU = dataDir + sunMap['assocU'];

if (sungearU !== null) {
    readData(dataDir+sungearU, function(response) {
        var nameParsed = sungearU.split('.');
        var title = nameParsed[0];
        var thisExperiment = new Experiment(species, title);
        lines = response.split('\n');
        var setNames = [];
        var header = lines[0].split("|");
        var i = 0;

        for (i = 0; i < header.length-1; i++) {
            var dataSet = header[i].trim();
            setNames.push(dataSet);
            thisExperiment.data[dataSet] = [];
        }

        for (i = 1; i < lines.length; i++) {
            var vals = lines[i].split("|");
            var gene = vals[vals.length-1].trim();
            for (var j = 0; j < vals.length-1; j++) {
                var thisValue = vals[j].trim();
                if (thisValue == 1) {
                    thisExperiment.data[setNames[j]].push(gene);
                }
            }
        }
        writeToJson(experimentFile, thisExperiment);
    });
} else if (geneU !== null && typeof geneU !== 'undefined') {
    readData(geneU, function(response1) {
        lines = response1.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line[0] == "{" || line == '') {
                continue;
            }
            parsed = line.split('|');
            name = parsed[0].trim();
            desc = parsed[1].trim();
            items.push(new Item(name, desc, species));
        }
        writeToJson(itemFile, items);
        readData(listU, function(response2) {
            lines = response2.split('\n');
            for (var j = 0; j < lines.length; j++) {
                var line = lines[j];
                if (line[0] == "{" || line == '') {
                    continue;
                }
                parsed = line.split('|');
                name = parsed[0].trim();
                desc = parsed[1].trim();
                toCat = new Category(species);
                toCat.id = name;
                toCat.description = desc;
                categories[name] = toCat;
            }
            readData(hierU, function(response3) {
                lines = response3.split('\n');
                for (var k = 0; k < lines.length; k++) {
                    var line = lines[k];
                    if (typeof line === 'undefined') {
                        continue;
                    }
                    if (line[0] == "{" || line == '') {
                        continue;
                    }
                    parsed = line.split('|');
                    name = parsed[0].trim();
                    var bChild = parsed[1].trim();
                    children = bChild.split(' ');
                    var thisCategory = categories[name];
                    if (thisCategory === null || typeof thisCategory === 'undefined') {
                        toCat = new Category(species);
                        toCat.id = name;
                        categories[name] = toCat;
                        thisCategory = categories[name];
                    }
                    for (var m = 0; m < children.length; m++) {
                        var thisChild = children[m];
                        categories[name].children.push(thisChild);
                        if (categories[thisChild] === null || typeof categories[thisChild] === 'undefined') {
                            toCat = new Category(species);
                            toCat.id = thisChild;
                            categories[thisChild] = toCat;
                        }
                        categories[thisChild].parents.push(name);
                    }
                }
                readData(assocU, function(response4) {
                    lines = response4.split('\n');
                    for (var l = 0; l < lines.length; l++) {
                        var line = lines[l];
                        if (typeof line === 'undefined') {
                            continue;
                        }
                        if (line[0] == "{" || line == '') {
                            continue;
                        }
                        parsed = line.split('|');
                        name = parsed[0].trim();
                        var zScore = parsed[1].trim();
                        var bChild = parsed[2].trim();

                        var thisCategory = categories[name];
                        if (thisCategory === null || typeof thisCategory === 'undefined') {
                            toCat = new Category(species);
                            toCat.id = name;
                            categories[name] = toCat;
                            thisCategory = categories[name];
                        }
                        categories[name].zScore = zScore;
                        if (bChild != '') {
                            children = bChild.split(' ');
                            for (var m = 0; m < children.length; m++) {
                                var thisChild = children[m];
                                categories[name].items.push(thisChild);
                            }
                        }
                    }
                    for (var catLabel in categories) {
                        catArr.push(categories[catLabel]);
                    }
                    writeToJson(categoryFile, catArr);
                });
            });
        });
    });
}



function readData(file, callback) {
    console.log("reading: " + file);

    var buf = new Buffer(5242880); // 5 MB - Lord hear our prayer.
    fs.open(file, 'r', function (err, fd) {
        if (err) {
            console.log(err);
        }
        console.log("File opened successfully!");
        console.log("Going to read the file");
        fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
            if (err) {
                console.log(err);
            }
            console.log(bytes + " bytes read");

            // Print only read bytes to avoid junk.
            if (bytes > 0) {
                callback(buf.slice(0, bytes).toString());
            }
        });
    });
}

function writeToJson(file, obj) {
    jsonfile.spaces = 4;
    jsonfile.writeFile(file, obj, function(err) {
       console.error(err);
    });
}