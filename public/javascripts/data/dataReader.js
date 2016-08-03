/**
 * Created 2016.07.07
 * @author RajahBimmy
 * I will laugh if this works.
 */

const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const url = require('url');
const request = require('request');

require('javascript.util');
const Iterator = javascript.util.Iterator;
const SortedSet = javascript.util.SortedSet;
const TreeSet = javascript.util.TreeSet;

const ParseException = require('./parseException');

const Anchor = require('../genes/anchor');
const Gene = require('../genes/gene');
const Term = require('../genes/term');
const Vessel = require('../genes/vessel');

/**
 * Constructs a new master data reader.
 * @param attrib {Attributes}
 * @constructor
 */
function DataReader(attrib) {
    this.attrib = attrib;
    this.clear();
}

DataReader.SEP = "\t|\\|";
DataReader.FSEP = ",| ";
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
        this.readGenes(geneU);
        this.readTerms(listU);
        this.readHierarchy(hierU);
        this.readGeneToGo(assocU);
        this.readSungear(sungearU);
    },
    /**
     * @param geneU {URL}
     * @param genes {Hashtable<String, Gene>}
     * @param a {Attributes}
     */
    readGenes : function(geneU, genes, a) {
        if (typeof genes == 'undefined') {
            this.allGenes = {};
            this.readGenes(geneU, this.allGenes, this.attrib);
        } else {
            DataReader.openURL(geneU, function(response) {
                DataReader.parseHeader(response, a, "items");
                for (var i = 0; i < response.length; i++) {
                    var line = response[i];
                    try {
                        var s = DataReader.trimAll(line.split(DataReader.SEP));
                        var pub = s[0];
                        var desc = s[1];
                        var g = new Gene(pub, desc);
                        genes[pub.toLowerCase()] = g;
                    } catch (e) {
                        console.log("Offending line: " + line);
                        throw new ParseException("parse error at line: " + i + " of " + geneU, line, e);
                    }
                }
            });
        }
    },
    /**
     * @param listU {URL}
     * @param terms {Hashtable<String, Term>}
     * @param a {Attributes}
     */
    readTerms : function(listU, terms, a) {
        if (typeof terms == 'undefined') {
            this.terms = {};
            this.readTerms(listU, this.terms, this.attrib);
        } else {
            DataReader.openURL(listU, function(response) {
                DataReader.parseHeader(response, a, "categories");
                for (var i = 0; i < response.length; i++) {
                    var line = response[i];
                    try {
                        var f = DataReader.trimAll(line.split(DataReader.SEP));
                        terms[f[0]] = new Term(f[0], f[1]);
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
    readHierarchy : function(hierU, terms, rootsV, a) {
        if (typeof terms == 'undefined') {
            this.roots = [];
            this.readHierarchy(hierU, this.terms, this.roots, this.attrib);
        } else {
            var rootsT = new TreeSet();
            // parse term parent/child relationships
            for (var key in terms) {
                rootsT.add(terms[key]);
            }
            DataReader.openURL(hierU, function(response) {
                DataReader.parseHeader(response, a, "hierarchy");
                for (var i = 0; i < response.length; i++) {
                    var line = response[i];
                    try {
                        var f = DataReader.trimAll(line.split(DataReader.SEP));
                        var s = DataReader.trimAll(f[1].split(DataReader.FSEP));
                        var t = terms[s[i]];
                        for (var j = 0; j < s.length; j++) {
                            var c = terms[s[j]];
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
                    rootsV.push(rootsTArray[i]);
                }
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
    readGeneToGo : function(assocU, genes, terms, geneToGo, a) {
        if (typeof genes == 'undefined') {
            this.geneToGo = {};
            this.readGeneToGo(assocU, this.allGenes, this.terms, this.geneToGo, this.attrib);
        } else {
            DataReader.openURL(assocU, function(response) {
                // parse GO / gene correspondence
                var missingGene = new TreeSet();
                var missingTerm = new TreeSet();
                DataReader.parseHeader(response, a, "correspondence");
                for (var i = 0; i < response.length; i++) {
                    var line = response[i];
                    try {
                        var f = line.split(DataReader.SEP);
                        var s = f.length < 3 ? [] : f[2].trim().split(DataReader.FSEP);
                        var tn = f[0].trim();
                        var t = terms[tn];
                        if (t == null || typeof t == 'undefined') {
                            missingTerm.add(tn);
                            continue;
                        }
                        var p_t = Number(f[1].trim());
                        t.setRatio(p_t);
                        for (var k = 0; k < s.length; k++) {
                            var gn = s[k].trim();
                            var g = genes[gn.toLowerCase()];
                            if (g === null || typeof g === 'undefined') {
                                missingGene.add(gn);
                            } else {
                                var genev = geneToGo[g];
                                if (genev === null || typeof genev === 'undefined') {
                                    genev = [];
                                }
                                genev.push(t);
                                t.addGene(g);
                                geneToGo[g] = genev;
                            }
                        }
                    } catch (e) {
                        console.log("Offending line: " + line);
                        throw new ParseException("parse error at line" + i + " of " + assocU, line, e);
                    }
                }
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
    readSungear : function(sungearU, genes, anchors, expGenes, missingGenes, dupGenes, a) {
        if (typeof genes == 'undefined') {
            this.anchors = [];
            this.expGenes = new TreeSet();
            this.missingGenes = new TreeSet();
            this.dupGenes = new TreeSet();
            this.readSungear(sungearU, this.allGenes, this.anchors, this.expGenes, this.missingGenes, this.dupGenes, this.attrib);
        } else {
            DataReader.openURL(sungearU, function(response) {
                DataReader.parseHeader(response, a, "sungear");
                // title line
                var line = response[0];
                var f = DataReader.trimAll(line.split(DataReader.SEP));
                var i = 0;
                for (i = 0; i < f.length-1; i++) {
                    anchors.push(new Anchor(f[i]));
                }
                var exp = [];
                for (i = 1; i < response.length; i++) {
                    line = response[i];
                    try {
                        if (line == "") {
                            continue;
                        }
                        f = DataReader.trimAll(line.split(DataReader.SEP));
                        // find current gene
                        var gn = f[anchors.length];
                        var g = genes[gn.toLowerCase()];
                        if (g === null || typeof g === 'undefined') {
                            missingGenes.add(gn);
                        } else if (expGenes.contains(g)) {
                            dupGenes.add(g);
                        } else {
                            expGenes.add(g);    // TODO: Ensure this is supposed to happen
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
            });
        }
    },

    // NOTE: setThreshold has moved to the static area.

    // NOTE: trimALl has moved to the static area.
    // NOTE: chop has moved to the static area.

    // NOTE: openURL has moved to the static area.
    // NOTE: readURL has moved to the static area.


    getResource : function(s) {
        // TODO: @Dennis Implement
    }
    // NOTE: parseHeader has moved to the static area.
};

// STATIC AREA:

/**
 * Updates vessel membership based on the provided threshold value.
 * @param t {float} threshold for vessel inclusion
 * @param expGenes {SortedSet<Gene>} all genes in the experiment set
 * @param anchors {Vector<Anchor>} experiment anchors (static)
 * @param vessels {Vector<Vessel>} updated vessels are placed here
 */
DataReader.setThreshold = function(t, expGenes, anchors, vessels) {
    var m = "";
    var last = "";
    var vh = {};
    var curr = null;
    for (var it = expGenes.iterator(); it.hasNext(); ) {
        var g = it.next();
        var e = g.getExp();
        for (var i = 0; i < e.length; i++) {
            if (e[i] < t) {
                m += "0";
            } else {
                m += "1";
            }
        }
        var sig = m;    // May be redundant
        if (m != last) {
            curr = vh[sig];
            if (curr === null) {
                var va = [];
                for (var j = 0; j < sig.length; j++) {
                    if (sig[j] == "1") {
                        va.push(anchors[j]);
                    }
                }
                curr = new Vessel(va);
                vessels.push(curr);
                vh[sig] = curr;
            }
            last = sig;
        }
        curr.addGene(g);
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
    if (u.indexOf('http') < 0) {
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
                // console.log("Pushing data");
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
                    zlib.gunzip(buffer, function(err, decoded) {
                        console.log(decoded);
                        if (err) {
                        } else {
                            raw = decoded.toString();
                            callback(raw);
                        }
                    });
                } else {
                    raw = chunks.toString();
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
        console.log("reading: " + u);
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
                    callback(buf.slice(0, bytes));
                }
            });
        });
    }
};

/**
 * Reads the header of a file into a StringBuffer.
 * @param u the URL of the file to read
 * @return the read text
 */
DataReader.readHeader = function(u) {
    // TODO: Implement?
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

// DataReader.testRequest = function(callback) {
//     var buffer = [];
//     var toGo = url.parse("http://virtualplant.bio.nyu.edu/virtualplant2/biovis2/data/annot_human.txt");
//     toGo.encoding = null;
//     toGo.url = "http://virtualplant.bio.nyu.edu/virtualplant2/biovis2/data/annot_human.txt";
//     console.log(toGo);
//     var req = request.get(toGo);
//     req.on('response', function(res) {
//         var chunks = [];
//         res.on('data', function(chunk) {
//             console.log("Pushing data");
//             chunks.push(chunk);
//         });
//         res.on('end', function() {
//             console.log("Finished!");
//             var buffer = Buffer.concat(chunks);
//             console.log(res.headers);
//             var encoding = res.headers['content-encoding'];
//             if (typeof encoding === 'undefined') {
//                 encoding = res.headers['content-type'];
//             }
//             if (encoding.indexOf('gzip') > -1) {
//                 console.log("Unzipping...");
//                 zlib.gunzip(buffer, function(err, decoded) {
//                     console.log(decoded);
//                     if (err) {
//                         console.log("Error :(");
//                         console.log(err);
//                     } else {
//                         console.log(decoded.toString());
//                     }
//                     callback();
//                 });
//             } else {
//                 //console.log(chunks.toString());
//             }
//         })
//     });
//     req.on('error', function(err) {
//         console.log("error :(");
//         console.log(err);
//         callback();
//     });
// };

module.exports = DataReader;