require('javascript.util');
var TreeSet = javascript.util.TreeSet;

function GoTerm(genes, fd) {
    this.genes = genes;
    this.geneThresh = 1;
    this.multi = false;
    this.collapsed = false;
    this.lastRowList = -1;
    this.terms = {};
    this.uniq = new TreeSet();
    this.all = new TreeSet();
    this.assocGenes = new TreeSet();
    this.tree = null; // TODO: @Dennis figure out how to implement a file tree.
    // TODO: Finish me.
}

GoTerm.sortOptions = [ "Sort by Z-Score", "Sort by Name", "Sort by Count" ];

GoTerm.prototype = {
    constructor : GoTerm,
    cleanup : function() {
        for (var it = this.roots.iterator(); it.hasNext(); ) {
            it.next().cleanup();
        }
        this.terms = {};
        this.geneToGo = {};
        this.uniq = new TreeSet();
        this.all = new TreeSet();
        this.assocGenes = new TreeSet();
        this.listModel.clear();
        this.genes = null;
        this.tree = null;
        this.results = null;
        this.findD = null;
    },
    /**
     * @param src {DataSource}
     */
    set : function(src) {
        this.terms = src.getReader().terms;
        this.roots = src.getReader().roots;
        this.geneToGo = src.getReader().geneToGo;
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getLeafTerms : function(g) {
        var v = this.geneToGo.get(g);
        return (v === null) ? [] : v;
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getCurrentTerms : function(g) {
        var v = this.geneGoIndir.get(g);
        return (v === null) ? [] : v;
    },
    updateGUI : function() {
        var iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.threshB.title = "Set threshold for active " + iL + " count";
        var cL = this.genes.getSource().getAttributes().get("categoriesLabel", "categories");
        this.collapseT.title = "Toggles collapsing list to selected " + cL + " only";
        this.findB.title = "Display all " + cL + " matching the search text";
        this.copyB.title = "Copy the currently selected " + cL + " to the clipboard";
        this.expandB.title = "Show all " + cL + " in the hierarchy";
        this.collapseB.title = "Hide all non-root " + cL + " in the hierarchy";
    },
    /**
     * Updates the selected gene count for each GO term.
     * Called when the selected subset is changed.
     */
    updateActiveGeneCounts : function() {
        this.assocGenes = new TreeSet();
        // TODO: Finish me.
    }
};

module.exports = GoTerm;