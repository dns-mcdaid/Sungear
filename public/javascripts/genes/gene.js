"use strict";
/**
 * Encapsulates information about a gene, the basic unit
 * of all Virtual Plant operations.
 * @author RajahBimmy
 */

/**
 * Constructs a new Gene.
 * @param name {String} the gene name.
 * @param desc {String} the gene description.
 */
function Gene(name, desc) {
    this.name = name;   /** {String} Gene PUB name */
    this.desc = desc;   /** {String} Gene description. */
    this.exp = [];      /** {float[]} Gene expression values */
    this.terms = [];
}

Gene.prototype = {
    constructor : Gene,
    /**
     * Gets the gene name.
     * @return {String} the gene name
     */
    getName : function() { return this.name; },
    /**
     * Gets the gene description.
     * @return {String} the gene description
     */
    getDesc : function() { return this.desc; },
    /**
     * Sets the expression values for this gene.
     * @param e {Array} the expression values
     */
    setExp : function(e) {
        this.exp = [];
        this.exp = e.slice();
    },
    /**
     * Gets the expression values for this gene.
     * @return {Array} the expression values
     */
    getExp : function(){ return this.exp; },
    /**
     * @param g {Gene}
     * @returns {number}
     */
    compareTo : function(g){
        const str1 = this.name.toLowerCase();
        const str2 = g.getName().toLowerCase();
        return str1.localeCompare(str2);
    },
    compare : function(g){
        const str1 = this.name.toLowerCase();
        const str2 = g.getName().toLowerCase();
        return str1.localeCompare(str2);
    },
    toString : function(){
        return this.name;
    },
    addTerm : function(term) {
        this.terms.push(term);
    },
    getTerms : function() {
        return this.terms;
    }
};

module.exports = Gene;
