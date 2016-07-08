/**
 * @author Dennis McDaid
 */

require('javascript.util');
var ArrayList = javascript.util.ArrayList;

var Gene = require('./gene');

/**
 *  An object that contains all genes for an anchor, the name of the
 *  anchor. The genes of the anchor can be sorted by their expression value.
 *  @param anchorName of type String
 */
function AnchorList(anchorName) {
    this.name = anchorName;                 /** @type String */
    this.oriGenes = new ArrayList();        /** @type ArrayList<Gene> */
    this.effectiveGenes = new ArrayList();  /** @type ArrayList<Gene> */
    this.sortedGenes = [];                  /** @type Gene[] */
    this.selectedGenes = 0;                 /** @type int */    // Is this ever used?
}

AnchorList.prototype = {
    constructor : AnchorList,
    getName : function(){
        return this.name;
    },
    /**
     *  test whether a gene is in the original list by its name
     *  @param geneID of type String
     */
    contains : function(geneID) {
        var toFind = new Gene(geneID, -99.0);
        return this.oriGenes.contains(toFind);
    },
    /**
     * ensure same gene will not be added twice
     * @param g of type Gene
     */
    addGene : function(g) {
        if (!this.oriGenes.contains(g)) {
            this.oriGenes.add(g);
        }
    },
    /**
     * add a gene to the effective genes list
     * @param g of type Gene
     */
    addEffectiveGene : function(g) {
        this.effectiveGenes.add(g);
    },
    /**
     * @param al of type ArrayList<Gene>
     */
    setEffectiveGene : function(al) {
        this.effectiveGenes = al;   // TODO: @Dennis make sure this works correctly. (Passing by reference vs. value)
    },
    getEffectiveGenes : function() {
        return this.effectiveGenes;
    },
    /**
     * get the number genes in the intersection of SunGear genes
     * and the ones from geneLights input
     */
    sizeOfEffectiveGenes : function() {
        return this.effectiveGenes.size();
    },
    /**
     * Sort the effective genes by their expression value ascendingly
     *
     * @return sorted effective genes.  null if there is no effectiveGenes
     */
    sortEffectiveGenes : function() {
        if (this.sizeOfEffectiveGenes() != 0) {
            this.sortedGenes = this.effectiveGenes.toArray(); // TODO: @Dennis make sure this works.
            this.sortedGenes.sort();    // TODO: @Dennis this should work, just ensure.
            return this.sortedGenes;
        } else {
            return null;
        }
    },
    /* should only be called after sortEffectiveGenes() is invoked */
    getSortedGenes : function() {
        return this.sortedGenes;
    },
    /**
     *  get the minimal expression value of the effective genes
     */
    getMinValue : function() {
        if (this.sortedGenes !== null) {
            var minGene = this.sortedGenes[0];
            return minGene.getValue();
        } else {
            return -100.0;
        }
    },
    /**
     *  get the maximal expression value of the effective genes
     */
    getMaxValue : function() {
        if (this.sortedGenes !== null) {
            var maxGene = this.sortedGenes[this.sortedGenes.length - 1];
            return maxGene.getValue();
        } else {
            return 100.0;
        }
    },
    /**
     *  get the number of genes in this anchor
     */
    size : function() {
        return this.oriGenes.size();
    },
    getSelectedGenes : function() {
        return this.selectedGenes;
    }
};

module.exports = AnchorList;