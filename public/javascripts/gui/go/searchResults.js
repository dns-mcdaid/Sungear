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
    this.findLTBody = document.getElementById('findLTBody');
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
        this.selectTerms();
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
      while(this.findLTBody.hasChildNodes()){
          this.findLTBody.removeChild(this.findLTBody.firstChild);
        }
        for(var i = 0; i < this.results.length; i++){
          const elementData = this.results[i];

          const row = document.createElement('tr');
          const val1 = row.insertCell(0);
          val1.innerHTML = elementData.getId();
          const val2 = row.insertCell(1);
          val2.innerHTML = elementData.getName();

          this.findLTBody.appendChild(row);
        }


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
    /**
    * Compare list of Term objects (this.results) to universal Gene set (this.genes) and find matches between them
    * Descriptions in Gene objects match Names in Term objects
    *
    */
    selectTerms : function(t) {
        let found = new SortedSet();
        this.genes.getActiveSet().forEach((gene) => {
  	    	this.results.forEach((term) => {
            if( gene.getDesc().toLowerCase().includes(term.getName().toLowerCase()) ){
              found.push(gene);
            }
          });
  	    });
        this.genes.setSelection(this, found);
    }
};

module.exports = SearchResults;
