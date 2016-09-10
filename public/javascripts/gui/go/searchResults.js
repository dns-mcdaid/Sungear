"use strict";
const SortedSet = require("collections/sorted-set");
/**
 * @author RajahBimmy
 * Search results list for GO term search.
 */

/**
 * Creates a new search results display component
 * @param genes {GeneList} corresponding gene list
 * @param g {GoTerm} display component
 */
function SearchResults(genes, g) {
    this.genes = genes; /** {GeneList} Central gene list */
    this.go = g;        /** {WeakReference<GoTerm>} Main GO term display component */
    // TODO: Check this bad boy:
    this.findL = document.getElementById('findL');          /** {JList} Search results list */
    this.statusF = document.getElementById('goStatusF');    /** {JTextField} Results status field */
    this.sortB = document.getElementById('goSortB');        /** {JComboBox} Sort order options */
    this.selectC = document.getElementById('selectC');      /** {JCheckBox} Select on click checkbox */

    // TODO: Add event listeners to findL
    this.sortB.addEventListener('click', this.updateList.bind(this));

    this.results = [];  /** {Vector<Term>} Matching GO Terms */
}

SearchResults.prototype = {
    constructor : SearchResults,
    /**
     * Updates the search results to be shown.
     * @param results {Array} of terms. the new results set
     */
    setResults : function(results) {
        this.results = results;
        this.statusF.innerHTML = "Matches: " + results.length;
        this.updateList();
    },
    /**
     * Gets the search result set size
     * @returns {Number} of matching terms
     */
    getMatchCount : function() {
        return this.results.length;
    },
    /**
     * Updates the results display, including sort order.
     */
    updateList : function() {
        // TODO: Implement me.
    },
    /**
     * Updates the highlighted term in the main GO term list.
     * @param t {Term} to highlight
     */
    showTerm : function(t) {
        if (t !== null && typeof t != 'undefined') {
            this.go.showTerm(t);
        }
    },
    selectTerms : function(t) {
        let s = new SortedSet();
        if (t !== null && typeof t !== 'undefined') {
            for (let i = 0; i < t.length; i++) {
                s = s.union(t[i].getAllGenes().toArray());
            }
        }
        this.genes.setSelection(this, s);
    }
};

module.exports = SearchResults;