"use strict";
/**
 * Created 2016.07.07
 * @author RajahBimmy
 * I will laugh if this works.
 */
const SortedSet = require("collections/sorted-set");

const Anchor = require('../genes/anchor');
const Gene = require('../genes/gene');
const Term = require('../genes/noHypeTerm');
const Vessel = require('../genes/vessel');

/**
 * Constructs a new master data reader.
 * @param attrib {Attributes}
 * @constructor
 */
function DataReader(attrib) {
    this.attrib = attrib;
    this.clear();
	this.debug = false;
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

    addPassedData : function(reader) {
    	
    	this.allGenes = new Map();
	    this.terms = new Map();
	    this.roots = [];
	    this.geneToGo = new Map();
	    this.anchors = [];
	    this.expGenes = new SortedSet();
	    
	    const rootsMap = new Map();

        // TODO: actually get all genes?
        const passedAnchors = reader.anchors;
        const passedItems = reader.items;
        const passedCategories = reader.categories;
        const passedSets = reader.expSets;

        passedAnchors.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
	    
	    passedAnchors.forEach((anchor) => {
	    	this.anchors.push(new Anchor(anchor.name));
	    });
	    
	    passedItems.forEach((gene) => {
	    	const exp = [];
		    const expGene = new Gene(gene.id, gene.description);
		    this.anchors.forEach((anchor, i) => {
		    	if (passedSets[anchor.name].indexOf(gene.id) > -1) {
		    		exp[i] = 1;
			    } else {
			    	exp[i] = 0;
			    }
		    });
		    expGene.setExp(exp);
		    this.expGenes.push(expGene);
		    this.allGenes.set(gene.id.toLowerCase(), expGene);
	    });
	    
	    passedCategories.forEach((category) => {
	    	const newTerm = new Term(category.id, category.description);
		    this.terms.set(category.id, newTerm);
		    rootsMap.set(category.id, newTerm);
	    });
	    
	    passedCategories.forEach((category) => {
	    	if (this.terms.has(category.id)) {
	    		const thisTerm = this.terms.get(category.id);
		        category.children.forEach((child) => {
		            if (this.terms.has(child)) {
		                const c = this.terms.get(child);
					    thisTerm.addChild(c);
					    c.addParent(thisTerm);
			            rootsMap.delete(c.getId());
				    }
			    });
			    if (category.zScore === null) {
			    	// TODO: Something? Maybe remove?
			    } else {
			    	thisTerm.setRatio(category.zScore);
			    }
			    category.items.forEach((item) => {
			    	const gName = item.toLowerCase();
				    if (this.allGenes.has(gName)) {
				    	const thisGene = this.allGenes.get(gName);
					    let geneArray = null;
					    if (!this.geneToGo.has(thisGene)) {
					    	geneArray = [];
					    } else {
					    	geneArray = this.geneToGo.get(thisGene);
					    }
					    geneArray.push(thisTerm);
					    thisTerm.addGene(thisGene);
					    this.geneToGo.set(thisGene, geneArray);
				    }
			    });
		    }
	    });
	    rootsMap.forEach((value, key) => {
	    	this.roots.push(value);
	    });
	    if (this.debug) {
		    console.log("ROOTS:");
		    console.log(this.roots);
		
		    console.log("TERMS TIME:");
		    console.log(this.terms);
		
		    console.log("GENE TO GO TIME");
		    console.log(this.geneToGo);
	    }
    }
};

// STATIC AREA:

/**
 * Updates vessel membership based on the provided threshold value.
 * @param t {float} threshold for vessel inclusion
 * @param expGenes {SortedSet} all genes in the experiment set
 * @param anchors {Array} of Vessels experiment anchors (static)
 * @param vessels {Array} of Anchors updated vessels are placed here
 */
DataReader.setThreshold = function(t, expGenes, anchors, vessels) {
    let m = "";
    let last = "";
    const vh = new Map();
    let curr = null;
    //noinspection JSUnresolvedFunction
    const expGenesArray = expGenes.toArray();
    for (let i = 0; i < expGenesArray.length; i++) {
        m = "";
        const g = expGenesArray[i];
        const e = g.getExp();
        for (let j = 0; j < e.length; j++) {
            if (e[j] < t) {
                m += "0";
            } else {
                m += "1";
            }
        }
        const sig = m;
        if (m != last) {
            curr = vh.get(sig);
            if (typeof curr === 'undefined') {
                const va = [];
                for (let j = 0; j < sig.length; j++) {
                    if (sig[j] == "1") {
                        va.push(anchors[j]);
                    }
                }
                curr = new Vessel(va);
                vessels.push(curr);
                vh.set(sig, curr);
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

module.exports = DataReader;