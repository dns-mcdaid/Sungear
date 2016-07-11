/**
 * Created on Nov 9, 2004
 * Copyright Chris Poultney 2004.
 * Updated by Dennis McDaid 2016.
 *
 * Encapsulates information about a gene, the basic unit
 * of all Virtual Plant operations.
 * @author crispy
 * @author Rajah_Bimmy
 */
/** @DONE */

/**
 * Constructs a new Gene.
 * @param name - the gene name.
 * @param desc - the gene description.
 */
function Gene(name, desc) {
    this.name = name; /** Type: String. Gene PUB name */
    this.desc = desc; /** Type: String. Gene description. */
    this.exp = [];    /** Type: float[]. Gene expression values */
}

Gene.prototype = {
    constructor : Gene,
    /**
     * Gets the gene name.
     * @return the gene name (String)
     */
    getName : function() {
        return this.name;
    },
    /**
     * Gets the gene description.
     * @return the gene description (String)
     */
    getDesc : function() {
        return this.desc;
    },
    /**
     * Sets the expression values for this gene.
     * @param e the expression values (float[])
     */
    setExp : function(e) {
        this.exp = [e.length];
        this.exp = e.slice();
    },
    /**
     * Gets the expression values for this gene.
     * @return the expression values (float[])
     */
    getExp : function(){
        return this.exp;
    },
    compareTo : function(g){
        var str1 = this.name.toLowerCase();
        var str2 = g.getName().toLowerCase();
        return str1.localeCompare(str2);
    },
    toString : function(){
        return this.name;
    }
};

module.exports = Gene;