/**
 * Created 2016.07.07
 * @author RajahBimmy
 * I will laugh if this works.
 */

const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

require('javascript.util');
const Iterator = javascript.util.Iterator;
const SortedSet = javascript.util.SortedSet;
const TreeSet = javascript.util.TreeSet;

var Anchor = require('../genes/anchor');
var Gene = require('../genes/gene');
var Term = require('../genes/term');
var Vessel = require('../genes/vessel');

/**
 * Constructs a new master data reader.
 * @param attrib of type Attributes
 * @constructor
 */
function DataReader(attrib) {
    this.attrib = attrib;
    this.clear();
}

DataReader.prototype = {
    constructor : DataReader,

    SEP : "\\t|\\|",
    FSEP : ",| ",
    NVSEP : "=",

    clear : function() {
        this.allGenes = null;
        this.terms = null;
        this.roots = null;
        this.geneToGo = null;
        this.anchors = null;
        this.expGenes = null;
    },
    /** @param attrib of type Attributes */
    setAttrib : function(attrib) {
        this.attrib = attrib;
    },
    /**
     * @param geneU of type URL
     * @param listU of type URL
     * @param hierU of type URL
     * @param assocU of type URL
     * @param sungearU of type URL
     */
    readAll : function(geneU, listU, hierU, assocU, sungearU) {
        this.readGenes(geneU);
        this.readTerms(listU);
        this.readHierarchy(hierU);
        this.readGeneToGo(assocU);
        this.readSungear(sungearU);
    },
    /**
     * @param geneU of type URL
     * @param genes of Hashtable<String, Gene>
     * @param a of type Attributes
     */
    readGenes : function(geneU, genes, a) {
        // TODO: @Dennis Implement
    },
    /**
     * @param listU of type URL
     * @param terms of type Hashtable<String, Term>
     * @param a of type Attributes
     */
    readTerms : function(listU, terms, a) {
        // TODO: @Dennis Implement
    },
    /**
     * @param hierU of type URL
     * @param terms of type Hashtable<String, Term>
     * @param rootsV of type Vector<Term>
     * @param a of type Attributes
     */
    readHierarchy : function(hierU, terms, rootsV, a) {
        // TODO: @Dennis Implement
    },
    /**
     * @param assocU of type URL
     * @param genes of type Hashtable<String, Gene>
     * @param terms of type Hashtable<String, Term>
     * @param geneToGo of type Hashtable<Gene, Vector<Term>>
     * @param a of type Attributes
     */
    readGeneToGo : function(assocU, genes, terms, geneToGo, a) {
        // TODO: @Dennis Implement
    },
    /**
     * @param sungearU of type URL
     * @param genes of type Hashtable<String, Gene>
     * @param anchors of type Vector<Anchor>
     * @param expGenes of type SortedSet<Gene>
     * @param missingGenes of type SortedSet<String>
     * @param dupGenes of type SortedSet<Gene>
     * @param a of type Attributes
     */
    readSungear : function(sungearU, genes, anchors, expGenes, missingGenes, dupGenes, a) {
        // TODO: @Dennis Implement
    },
    /**
     * Updates vessel membership based on the provided threshold value.
     * @param t threshold for vessel inclusion
     * @param expGenes all genes in the experiment set
     * @param anchors experiment anchors (static)
     * @param vessels updated vessels are placed here
     */
    setThreshold : function(t, expGenes, anchors, vessels) {
        var m = "";
        var last = "";
        var vh = [];
        var curr = null;
        // TODO: @Dennis Implement
    },
    /**
     * Trims all the elements of an array of Strings, and returns the result.
     * The original array's contents are not modified.
     * @param s the array of Strings to trim
     * @return the array of trimmed Strings
     */
    trimAll : function(s) {
        var r = []; /** @type String[] */
        for (var i = 0; i < s.length; i++) {
            r[i] = s[i].trim();
        }
        return r;
    },
    /**
     * Chops a StringBuffer into an array of lines.
     * @param b the data to separate into lines
     * @return Array array of separated lines
     */
    chop : function(b) {
        return b.toString().split("\\n");
    },
    openURL : function(u) {
        console.log("opening: " + u);
        // TODO: @Dennis Implement
    },
    /**
     * Reads the entire text contents of a URL into a StringBuffer.
     * @param u the URL to read
     * @return the read text
     * @throws IOException
     */
    readURL : function(u) {
        // TODO: @Dennis Implement
    },
    /**
     * Reads the header of a file into a StringBuffer.
     * @param u the URL of the file to read
     * @return the read text
     * @throws IOException
     */
    readHeader : function(u) {
        // TODO: @Dennis Implement
    },

    makeURL : function(base, s) {
        // TODO: @Dennis Implement
    },

    getResource : function(s) {
        // TODO: @Dennis Implement
    },

    parseHeader : function(){
        // TODO: @Dennis Implement
        var comment = "";
        var line = "";
    }
};

module.exports = DataReader;