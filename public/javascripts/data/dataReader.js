"use strict";
/**
 * Created 2016.07.07
 * @author RajahBimmy
 */
const url = require('url');
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
	 * In the original SunGear, there were quite a few methods called for opening Gene, Category, Hierarchy, Relationship, and Experiment files.
	 * When Dennis said "Hey Dennis (referencing me, other Dennis), why don't you port SunGear to JavaScript?" I figured we'd replicate the file reading methods.
	 * Oh boy was I wrong. So now we just pass a data object to the page, and once loaded, this method literally just plucks values from that data object
	 * to build all the Anchors, Vessels, Genes, and Terms we need for this app.
	 *
	 * @param data {Object}
	 */
    addPassedData : function(data) {

    	this.allGenes = new Map();
	    this.terms = new Map();
	    this.roots = [];
	    this.geneToGo = new Map();
	    this.anchors = [];
	    this.expGenes = new SortedSet();

	    const rootsMap = new Map();

        const passedAnchors = data.anchors;
        const passedItems = data.items;
        const passedCategories = data.categories;
        const passedSets = data.expSets;

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
	    rootsMap.forEach(value => { this.roots.push(value) });
    }
};

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
	expGenes.forEach((g) => {
		m = "";
		const e = g.getExp();
		e.forEach(idx => (idx < t) ? m += "0" : m+= 1);
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
	});
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
DataReader.chop = function(b) { return b.toString().split("\n"); };
/**
 * @param base {String}
 * @param s {String}
 * @return {URL}
 */
DataReader.makeURL = function(base, s) {
    let u;
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
