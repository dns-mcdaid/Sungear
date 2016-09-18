/**
 * Created 2016.07.07
 * @author RajahBimmy
 * I will laugh if this works.
 */

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const mongodb = require('mongodb');
const url = require('url');
const request = require('request');
const SortedSet = require("collections/sorted-set");

const ParseException = require('./legacy/parseException');

const Anchor = require('../public/javascripts/genes/anchor');
const Gene = require('../public/javascripts/genes/gene');
const Term = require('../public/javascripts/genes/term');

/**
 * Constructs a new master data reader.
 * @param attrib {Attributes}
 * @constructor
 */
function DataReader(attrib) {
    this.attrib = attrib;
    this.clear();
}

DataReader.SEP = "|";
DataReader.FSEP = " ";
DataReader.NVSEP = "=";

DataReader.prototype = {
    constructor : DataReader,

    clear : function() {
        this.allGenes = null;
        this.terms = null;
        this.roots = null;
        this.geneToGo = null;
        this.anchors = null;
        this.expGenes = null;
    },
    /**
     * @param attrib {Attributes}
     * */
    setAttrib : function(attrib) {
        this.attrib = attrib;
    },
    /**
     * @param geneU {URL}
     * @param listU {URL}
     * @param hierU {URL}
     * @param assocU {URL}
     * @param sungearU {URL}
     */
    readAll : function(geneU, listU, hierU, assocU, sungearU) {
        this.readGenes(geneU, function() {
            console.log("read genes.");
        });
        this.readTerms(listU, function() {
            console.log("read terms.");
        });
        this.readHierarchy(hierU, function() {
            console.log("read hierarchies.");
        });
        this.readGeneToGo(assocU, function() {
            console.log("read genes to go");
        });
        this.readSungear(sungearU, function() {
            console.log("read sungear.");
        });
    },
    /**
     * @param geneU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param a {Attributes}
     */
    readGenes : function(geneU, callback, genes, a) {
        if (typeof a == 'undefined') {
            this.allGenes = new Map();
            this.readGenes(geneU, callback, this.allGenes, this.attrib);
        } else {
            console.log("In readGenes!");
            DataReader.openURL(geneU, function(response) {
                DataReader.parseHeader(response, a, "items");
                var lines = response.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    try {
                        var s = DataReader.trimAll(line.split(DataReader.SEP));
                        var pub = s[0];
                        var desc = s[1];
                        var g = new Gene(pub, desc);
                        genes.set(pub.toLowerCase(), g);
                    } catch (e) {
                        console.log("Offending line: " + line);
                        throw new ParseException("parse error at line: " + i + " of " + geneU, line, e);
                    }
                }
                callback();
            });
        }
    },
    /**
     * @param listU {URL}
     * @param terms {Hashtable<String, Term>}
     * @param a {Attributes}
     */
    readTerms : function(listU, callback, terms, a) {
        if (typeof a == 'undefined') {
            this.terms = new Map();
            this.readTerms(listU, callback, this.terms, this.attrib);
        } else {
            DataReader.openURL(listU, function(response) {
                DataReader.parseHeader(response, a, "categories");
                var lines = response.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    try {
                        var f = DataReader.trimAll(line.split(DataReader.SEP));
                        if (f.length > 1) {
                            terms.set(f[0], new Term(f[0], f[1]));
                        }
                        if (i == lines.length-1) {
                            callback();
                        }
                    } catch (e) {
                        console.log("Offending line: " + line);
                        throw new ParseException("parse error at line " + i + " of " + listU, line, e);
                    }
                }

            });
        }
    },
    /**
     * @param hierU {URL}
     * @param terms {Hashtable<String, Term>}
     * @param rootsV {Vector<Term>}
     * @param a {Attributes}
     */
    readHierarchy : function(hierU, callback, terms, rootsV, a) {
        if (typeof terms == 'undefined') {
            this.roots = [];
            this.readHierarchy(hierU, callback, this.terms, this.roots, this.attrib);
        } else {
            console.log("In the second part!");
            var rootsT = new SortedSet();
            // parse term parent/child relationships
            for (var key in terms) {
                rootsT.push(terms[key]);
            }
            DataReader.openURL(hierU, function(response) {
                DataReader.parseHeader(response, a, "hierarchy");
                var lines = response.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.length < 6) {
                        continue;
                    }
                    try {
                        var f = DataReader.trimAll(line.split(DataReader.SEP));
                        var s = DataReader.trimAll(f[1].split(DataReader.FSEP));
                        var t = terms[f[0]];
                        for (var j = 0; j < s.length; j++) {
                            var c = terms.get(s[j]);
                            if (c !== null && typeof c != 'undefined') {
                                t.addChild(c);
                                t.addParent(t);
                                rootsT.remove(c);
                            }
                        }
                    } catch (e) {
                        throw new ParseException("parse error at line " + i + " of " + hierU, line, e);
                    }
                }
                var rootsTArray = rootsT.toArray();
                for (var k = 0; k < rootsTArray.length; k++) {
                    rootsV.push(rootsTArray[k]);
                }
                callback();
            });
        }
    },
    /**
     * @param assocU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param terms {Hashtable<String, Term>}
     * @param geneToGo {Hashtable<Gene, Vector<Term>>}
     * @param a {Attributes}
     */
    readGeneToGo : function(assocU, callback, genes, terms, geneToGo, a) {
        if (typeof genes == 'undefined') {
            this.geneToGo = new Map();
            this.readGeneToGo(assocU, callback, this.allGenes, this.terms, this.geneToGo, this.attrib);
        } else {
            DataReader.openURL(assocU, function(response) {
                // parse GO / gene correspondence
                var missingGene = new SortedSet();
                var missingTerm = new SortedSet();
                var lines = response.split("\n");
                DataReader.parseHeader(response, a, "correspondence");
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    console.log(i + "/" + lines.length);
                    if (line.length < 1) {
                        continue;
                    }
                    // try {
                    var f = line.split(DataReader.SEP);
                    var s = f.length < 3 ? [] : f[2].trim().split(DataReader.FSEP);
                    var tn = f[0].trim();
                    var t = terms.get(tn);

                    if (t == null || typeof t == 'undefined') {
                        missingTerm.push(tn);
                        continue;
                    }
                    var p_t = Number(f[1].trim());
                    // if ( i == 246 ) {
                    //     // console.log("F: " + f);
                    //     // console.log("S: " + s);
                    //     console.log("TN: " + tn);
                    //     console.log("T: " + t);
                    //     console.log("p_t: " + p_t);
                    // }
                    t.setRatio(p_t);
                    for (var k = 0; k < s.length; k++) {
                        var gn = s[k].trim();
                        var g = genes.get(gn.toLowerCase());
                        if (g === null || typeof g === 'undefined') {
                            missingGene.push(gn);
                        } else {
                            var genev = geneToGo.get(g);
                            if (genev === null || typeof genev === 'undefined') {
                                genev = [];
                            }
                            // console.log("Genev: " + i + ": " + k + "/" + s.length + ": " + genev);
                            genev.push(t);
                            t.addGene(g);
                            geneToGo.set(g, genev);
                        }
                    }
                    // } catch (e) {
                    //     console.log("Offending line: " + line);
                    //     console.log(e);
                    //     throw new ParseException("parse error at line" + i + " of " + assocU, line, e);
                    // }
                }
                callback();
            });
        }
    },
    /**
     * @param sungearU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param anchors {Array} of anchors
     * @param expGenes {SortedSet<Gene>}
     * @param missingGenes {SortedSet<String>}
     * @param dupGenes {SortedSet<Gene>}
     * @param a {Attributes}
     */
    readSungear : function(sungearU, callback, genes, anchors, expGenes, missingGenes, dupGenes, a) {
        if (typeof genes == 'undefined') {
            this.anchors = [];
            this.expGenes = new SortedSet();
            this.missingGenes = new SortedSet();
            this.dupGenes = new SortedSet();
            this.readSungear(sungearU, callback, this.allGenes, this.anchors, this.expGenes, this.missingGenes, this.dupGenes, this.attrib);
        } else {
            DataReader.openURL(sungearU, function(response) {
                DataReader.parseHeader(response, a, "sungear");
                // title line
                var lines = response.split('\n');
                var line = lines[0];
                var f = DataReader.trimAll(line.split(DataReader.SEP));
                var i = 0;
                for (i = 0; i < f.length-1; i++) {
                    anchors.push(new Anchor(f[i]));
                }
                var exp = [];
                for (i = 1; i < lines.length; i++) {
                    line = lines[i];
                    try {
                        if (line == "") {
                            continue;
                        }
                        f = DataReader.trimAll(line.split(DataReader.SEP));
                        // find current gene
                        var gn = f[anchors.length];
                        var g = genes.get(gn.toLowerCase());
                        if (g === null || typeof g === 'undefined') {
                            missingGenes.push(gn);
                        } else if (expGenes.contains(g)) {
                            dupGenes.push(g);
                        } else {
                            expGenes.push(g);    // TODO: Ensure this is supposed to happen
                            // Gene does not yet exist in experiment set
                            for (var j = 0; j < anchors.length; j++) {
                                exp[j] = Number(f[j]);
                            }
                            g.setExp(exp);
                        }
                    } catch (e) {
                        console.log("offending line: " + line);
                        throw new ParseException("parse error at line " + i + " of " + sungearU, line, e);
                    }
                }
                callback();
            });
        }
    },

    getResource : function(s) {
        // TODO: @Dennis Implement
    },
    getMongoFromExp : function(species, experiment, callback) {
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://localhost:27017/sungear';

        this.allGenes = {};
        this.roots = [];
        this.terms = {};
        this.geneToGo = {};
        this.anchors = [];
        this.expGenes = new SortedSet();
        this.missingGenes = new SortedSet();
        this.dupGenes = new SortedSet();

        this.expSets = {};

        var anchors = this.anchors;
        var attrib = {};

        this.items = [];
        this.categories = [];

        var expSets = this.expSets;
        var items = this.items;
        var categories = this.categories;
        var expGenesNames = [];



        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);

            console.log("Connection established.");
            var experimentsCol = db.collection('experiments');
            var itemsCol = db.collection('items');
            var categoriesCol = db.collection('categories');
            var speciesCol = db.collection('species');

            speciesCol.find({'name': species}).toArray(function (err, result) {
                assert.equal(err, null);
                assert.notEqual(0, result.length);

                console.log("Got the species!");
                var thisSpecies = result[0].name;
                attrib['species'] = thisSpecies;
                var u = 'mongo ' + thisSpecies;

                attrib['geneU'] = u;
                attrib['listU'] = u;
                attrib['hierU'] = u;
                attrib['assocU'] = u;
                attrib['sungearU'] = experiment;
                if (result[0].itemsLabel !== null && typeof result[0].itemsLabel !== 'undefined') {
                    attrib['comment-items'] = result[0].itemsLabel;
                }
                if (result[0].categoriesLabel !== null && typeof result[0].categoriesLabel !== 'undefined') {
                    attrib['comment-categories'] = result[0].categoriesLabel;
                }
                experimentsCol.find({
                    'name': experiment,
                    'species': thisSpecies
                }).toArray(function(err, result) {
                    assert.equal(err, null);
                    assert.notEqual(0, result.length);
                    console.log("Got the experiment!");

                    var thisExperiment = result[0];
                    var lists = thisExperiment.data;
                    var setNames = Object.keys(thisExperiment.data);
                    for (var i = 0; i < setNames.length; i++) {
                        var setName = setNames[i];
                        anchors.push(new Anchor(setName));
                        var thisList = lists[setName];
                        expSets[setName] = thisList;
                        for (var j = 0; j < thisList.length; j++) {
                            var gn = thisList[j];
                            expGenesNames.push(gn);
                        }
                    }

                    itemsCol.find({'species': thisSpecies}).toArray(function(err, result) {
                        assert.equal(err, null);
                        assert.notEqual(0, result.length);

                        console.log("Got the genes!");
                        console.log(result.length);
                        var concat = result.filter(function(gene) {
                           return expGenesNames.indexOf(gene.id) > -1;
                        });
                        for (var i = 0; i < concat.length; i++) {
                            items.push(concat[i]);
                        }
                        expGenesNames = items.map(function(gene) {
                            return gene.id.toUpperCase();
                        });
                        categoriesCol.find({'species': thisSpecies}).toArray(function(err, result) {
                            assert.equal(err, null);
                            assert.notEqual(0, result.length);

                            console.log("Got the categories!");
                            console.log(result.length);
                            var concat = result.filter(function(category) {
                               for (var i = 0; i < category.items.length; i++) {
                                   var item = category.items[i];
                                   if (expGenesNames.indexOf(item) > -1) {
                                       return true;
                                   }
                               }
                               return false;
                            });
                            for (var i = 0; i < concat.length; i++) {
                                categories.push(concat[i]);
                            }
                            db.close();
                            callback(attrib);
                        });
                    });
                });
            });
        });
    }
};

/**
 * Trims all the elements of an array of Strings, and returns the result.
 * The original array's contents are not modified.
 * @param s the array of Strings to trim
 * @return {Array} of trimmed Strings
 */
DataReader.trimAll = function(s) {
    var r = []; /** {String[]} */
    for (var i = 0; i < s.length; i++) {
        r[i] = s[i].trim();
    }
    return r;
};

/**
 * Chops a StringBuffer into an array of lines.
 * @param b the data to separate into lines
 * @return Array array of separated lines
 */
DataReader.chop = function(b) {
    return b.toString().split("\n");
};

DataReader.openURL = function(u, callback) {
    if (u.indexOf('http') < 0 || u.indexOf('txt.gz') < 0) {
        DataReader.readURL(u, function(response) {
            callback(response);
        });
    } else {
        console.log("Opening: " + u);
        u.url = u.href;
        u.encoding = null;
        var req = request.get(u);
        req.on('response', function(res) {
            var chunks = [];
            res.on('data', function(chunk) {
                console.log("Pushing data");
                chunks.push(chunk);
            });
            res.on('end', function() {
                console.log("Finished!");
                var buffer = Buffer.concat(chunks);
                console.log(res.headers);
                var encoding = res.headers['content-encoding'];
                if (typeof encoding === 'undefined') {
                    encoding = res.headers['content-type'];
                }
                if (encoding.indexOf('gzip') > -1) {
                    console.log("Unzipping...");
                    DataReader.openGz(buffer, function(response) {
                        callback(response);
                    })
                } else {
                    callback(chunks.toString());
                }
            });
        });
        req.on('error', function(err) {
            console.log("error :(");
            console.log(err);
            callback();
        });
    }
};
/**
 * Reads the entire text contents of a URL into a StringBuffer.
 * @param u {URL}
 * @param callback {function}
 * @return
 * @throws IOException
 */
DataReader.readURL = function(u, callback) {
    if (u.indexOf('http') > -1) {
        DataReader.openURL(u, function(response) {
            callback(response);
        });
    } else {
        DataReader.openLocal(u, function(response) {
            callback(response);
        });
    }
};

DataReader.openLocal = function(u, callback) {
    console.log("reading: " + u + " in openLocal");

    var buf = new Buffer(5242880); // 5 MB - Lord hear our prayer.
    fs.open(u, 'r', function (err, fd) {
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
                if (u.indexOf('.gz') > -1) {
                    DataReader.openGz(buf.slice(0,bytes), function(response){
                        callback(response);
                    });
                } else {
                    callback(buf.slice(0, bytes).toString());
                }
            }
        });
    });
};

DataReader.openGz = function(buffer, callback) {
    console.log("In openGz!");
    zlib.gunzip(buffer, function(err, decoded) {
        if (err) {
        } else {
            raw = decoded.toString();
            callback(raw);
        }
    });
};

/**
 * @param base {URL}
 * @param s {String}
 * @return {URL}
 */
DataReader.makeURL = function(base, s) {
    var u;
    try {
        u = new URL(s);
    } catch(mu) {
        try {
            u = new URL(s, base);
        } catch (mu2) {
            // This should be impossible because Mewtwo is hard as fuck to catch in the original games /s
            u = url.resolve(base, s);
        }
    }
    return u;
};

DataReader.parseHeader = function(raw, a, commentPrefix) {
    if (typeof commentPrefix === 'undefined') {
        commentPrefix = null;
    }
    var comment = "";
    var lines = raw.split('\n');
    for (var i = 0; i < lines.length; i++) {
        // This next line is probably redundant.
        var line = lines[i];
        if (line === null) {
            break;
        }
        if (line[0] == "#") {
            comment += lines[i] + "\n";
            continue;
        } else if (line == "") {
            continue;
        } else if (line[0] == "{" && line[lines.length-1] == "}") {
            var l = line.indexOf(DataReader.NVSEP);
            if (l == -1) {
                throw new ParseException("parse error at line " + i + ": invalid name=value pair in header", line);
            }
            var n = line.substr(1, l).trim();
            var v = line.substr(l+1, line.length).trim();
            console.log(n + " = " + v);
            a.put(n, v);
        } else {
            break;
        }
    }
    if (commentPrefix !== null && comment !== "") {
        a.put("comment-" + commentPrefix, comment);
    }
};

module.exports = DataReader;