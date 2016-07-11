require('javascript.util');
var SortedSet = javascript.util.SortedSet;
var TreeSet = javascript.util.TreeSet;

var DataSource = require('../data/dataSource');
var ParseException = require('../data/parseException');
var GeneEvent = require('./geneEvent');

/**
 * The central class for gene subset selection operations.
 * Maintains master gene table as well as relevant gene sets: all genes in the
 * current experiment, the current set of &quot;active&quot; genes, which is either the
 * full experiment set or the result of a Narrow operations; the set of currently selected
 * genes; and the set of highlighted genes.  Registers listeners ({@link GeneListener},
 * {@link MultiSelectable} and handles sending of {@link GeneEvent}s when sets change.
 * Finally, handles history storage and navigation for selection operations within the
 * current active set.
 *
 * <p>Generally one copy of this class should be instantiated by the main class,
 * and kept alive throughout the existence of that class.
 *
 * @author crispy
 */

/**
 * Constructs a new gene list.  The list is useless until
 * {@link #setSource(data.DataSource)} is called.
 */
function GeneList() {
    this.master = {};                   /** Master table of all genes in this species */
    this.genesS = new SortedSet();      /** List of all genes in the current experiment */
    this.activeS = new SortedSet();     /** List of genes in the current active set */
    this.selectionS = new SortedSet();  /** List of the current selected genes */
    this.highlightS = new SortedSet();  /** List of the currently highlighted genes */
    this.listeners = [];                /** {@link GeneEvent} listeners */
    this.multiSelectable = [];          /** Components that participate in multiple selection */
    this.hist = [];                  /** Gene list browsing history */
    this.source = null;                 /** Data source for this gene list */
    this.multi = false;                 /** True if within a multi-select operation */
}

GeneList.prototype = {
    constructor : GeneList,
    /**
     * Frees up memory resources for garbage collection.
     */
    cleanup : function() {
        this.master = null;
        this.genesS = null;
        this.activeS = null;
        this.selectionS = null;
        this.highlightS = null;
        this.listeners = null;
        this.multiSelectable = null;
        this.hist = null;
    },
    /**
     * Associates this gene list with a data source; called when the master data is (re)read.
     * @param src the new data source
     */
    setSource : function(src) {
        this.source = src;
        this.master = src.getReader().allGenes;
        console.log("total items: " + this.master.length);
        var ge = new GeneEvent(this, this, GeneEvent.NEW_SOURCE);
        this.notifyGeneListeners(ge);
    },
    /**
     * Updates the set of valid genes when a new experiment is loaded.
     * The experiment file is parsed to obtain the active genes.
     * @throws ParseException if the data source has not yet been set, if there are no active genes, or if there is a parsing error
     */
    update : function() {
        if (this.source === null) {
            throw new ParseException("data source not initialized.");
        } else {
            this.genesS = new SortedSet();
            this.genesS.addAll(this.source.getReader().expGenes);
            var iL = this.source.getAttributes().get("itemsLabel", "items");
            if (this.genesS.isEmpty()) {
                throw new ParseException("no " + iL + " in data set");
            } else {
                this.activeS = new SortedSet();
                this.activeS.addAll(this.genesS);
                this.selectionS = new SortedSet();
                this.selectionS.addAll(this.genesS);
                this.hist = [];
                this.hist.push(this.selectionS);
                console.log("working items: " + this.genesS.size());
                var ge = new GeneEvent(this, this, GeneEvent.NEW_LIST);
                this.notifyGeneListeners(ge);
                this.setMulti(false, this);
            }
        }
    },
    /**
     * Gets the current data source.
     * @return the data source
     */
    getSource : function() {
        return this.source;
    },
    /**
     * Gets the set of genes recognized by the gene list (generally
     * all genes for the current species).  This list is not limited
     * by the current experiment set.
     * @return the full gene set
     */
    getAllGenes : function() {
        var toReturn = new TreeSet();
        for (var key in this.master) {
            toReturn.add(this.master[key]);
        }
        return toReturn;
    },
    /**
     * Gets the full set of genes for this experiment.
     * @return the gene set, as a set
     */
    getGenesSet : function() {
        return this.genesS;
    },
    /**
     * Gets the current active gene set.
     * @return the active set
     */
    getActiveSet : function() {
        return this.activeS;
    },
    /**
     * Gets the currently selected gene set.
     * @return the current selection, as a set
     */
    getSelectedSet : function() {
        return this.selectionS;
    }
};

module.exports = GeneList;