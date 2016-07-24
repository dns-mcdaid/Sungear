require('javascript.util');
var SortedSet = javascript.util.SortedSet;
var TreeSet = javascript.util.TreeSet;

var DataSource = require('../data/dataSource');
var ParseException = require('../data/parseException');
var GeneEvent = require('./geneEvent');
var MultiSelectable = require('./multiSelectable');

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
    this.hist = new History();          /** Gene list browsing history */
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
        this.hist.clear();
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
            var toAdd = this.source.getReader().expGenes.toArray(); // TODO: Ensure this works.
            for (var i = 0; i < toAdd.length; i++) {
                this.geneS.add(toAdd[i]);
            }
            var iL = this.source.getAttributes().get("itemsLabel", "items");
            if (this.genesS.isEmpty()) {
                throw new ParseException("no " + iL + " in data set");
            } else {
                this.activeS = new SortedSet();
                this.selectionS = new SortedSet();
                var tempGenesS = this.genesS.toArray();
                for (i = 0; i < tempGenesS.length; i++) {
                    this.activeS.add(tempGenesS[i]);
                    this.selectionS.add(tempGenesS[i]);
                }
                this.hist.clear();
                this.hist.add(this.selectionS);
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
    },
    /**
     * Determines if a gene is in the current selection.
     * @param g the gene to test
     * @return true if selected, otherwise false
     */
    isSelected : function(g) {
        return this.selectionS.contains(g);
    },
    /**
     * Sets the current selected set.
     * @param src the source of the selection change
     * @param sel the new selection
     * @param sendEvent true to generate a {@link GeneEvent} with selection, otherwise false
     * @param addHist true to update browsing history, otherwise false
     */
    setSelection : function(src, sel, sendEvent, addHist) {
        if (typeof sendEvent === 'undefined') {
            sendEvent = true;
            addHist = true;
        }
        this.selectionS = new SortedSet();
        for (var i = 0; i < sel.length; i++) {
            if (this.activeS.indexOf(sel[i]) > -1) {
                this.selectionS.add(sel[i]);
            }
        }
        if (addHist) {
            this.hist.add(this.selectionS);
        }
        if (sendEvent) {
            var e = new GeneEvent(this, src, GeneEvent.SELECT);
            this.notifyGeneListeners(e);
        }
    },
    /**
     * Performs a Narrow operation: updates the active set by setting to all currently selected genes.
     * @param src the object that generated the Narrow operation
     */
    narrow : function(src) {
        this.setActive(src, this.selectionS);
    },
    /**
     * Performs a Restart operation: returns all sets to their condition immediately after initial load.
     * @param src the source of the Restart operation
     */
    restart : function(src) {
        this.setActive(src, this.genesS, false);
        var e = new GeneEvent(this, src, GeneEvent.RESTART);
        this.notifyGeneListeners(e);
        this.setMulti(false, src);
    },
    /**
     * Sets the active gene set
     * @param src object that generated the change to the active set
     * @param s the new active set
     * @param sendEvent true to generate a {@link GeneEvent} on set change, otherwise false
     */
    setActive : function(src, s, sendEvent) {
        if (typeof sendEvent === 'undefined') {
            sendEvent = true;
        }
        this.activeS = new SortedSet();
        this.activeS.addAll(s);
        this.hist.clear();
        this.setSelection(this, this.activeS, false, true);
        if (sendEvent) {
            var e = new GeneEvent(this, src, GeneEvent.NARROW);
            this.notifyGeneListeners(e);
            this.setMulti(false, src);
        }
    },
    /**
     * Finds the gene whose name matches the passed name.
     * @param pub the name to match
     * @return the matching gene, or null if no match found
     */
    find : function(pub) {
        return this.master.get(pub.toLowerCase());
    },

    // MULTI-SELECT (UNION, INTERSECT) STUFF

    /**
     * Registers a multi-select event listener.
     * @param comp the object to register
     */
    addMultiSelect : function(comp) {
        this.multiSelectable.push(comp);
    },
    /**
     * Sets the state of the multi-select indicator.
     * @param b true if performing a multiple select, otherwise false
     * @param source the object generating the state switch request
     */
    setMulti : function(b, source) {
        if (this.multi != b) {
            var e = null;
            if (b) {
                e = new GeneEvent(this, source, GeneEvent.MULTI_START);
            } else {
                e = new GeneEvent(this, source, GeneEvent.MULTI_FINISH);
            }
            this.notifyGeneListeners(e);
            this.multi = b;
        }
    },
    /**
     * Starts a multiple select operation.
     * @param source the object initiating the multi-select
     */
    startMultiSelect : function(source) {
        this.setMulti(true, source);
    },
    /**
     * Finalizes a multiple select operation - gathers the selected genes from all components
     * and performs the appropriate set operation on the sets.
     * @param source the object requesting the multi-select finalization
     * @param operation one of the {@link MultiSelectable} operations (currently union or intersect)
     */
    finishMultiSelect : function(source, operation) {
        var s = new TreeSet();
        if (operation == MultiSelectable.INTERSECT) {
            s.addAll(this.selectionS);
        }
        for (var it = this.multiSelectable.iterator(); it.hasNext(); ) {
            var g = it.next().getMultiSelection(operation);
            if (g !== null) {
                if (operation == MultiSelectable.UNION) {
                    s.addAll(g);
                } else {
                    s = new TreeSet();
                    s.addAll(g);
                }
            }
        }
        this.setMulti(false, source);
        this.setSelection(source, s);
    },

    // STANDARD LISTENER STUFF

    /**
     * Registers a regular {@link GeneEvent} listener.
     * @param l the object to register
     */
    addGeneListener : function(l) {
        if (this.listeners.indexOf(l) < 0) {
            this.listeners.push(l);
        }
    },
    /**
     * Removes an object from the list of {@link GeneEvent} listeners.
     * @param l the object to remove
     */
    removeGeneListener : function(l) {
        var idx = this.listeners.indexOf(l);
        if (idx > -1) {
            this.listeners.splice(idx, 1);
        }
    },
    /**
     * Notifies all registered {@link GeneListener}s of a new gene event.
     * @param e the gene event
     */
    notifyGeneListeners : function(e) {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].listUpdated(e);
        }
    },

    // BROWSING HISTORY

    /**
     * Determines if there is a &quot;previous&quot; selection in the browsing history.
     * @return true if such a set exists, otherwise false
     */
    hasPrev : function() {
        return this.hist.hasPrev();
    },
    /**
     * Determines if there is a &quot;next&quot; selection in the browsing history.
     * @return true if such a set exists, otherwise false
     */
    hasNext : function() {
        return this.hist.hasNext();
    },
    /**
     * Moves forward one selection in the browsing history,
     * and updates the current selection.
     * @param src the source of the selection change
     */
    forward : function(src) {
        var s = this.hist.forward();
        if (s !== null) {
            this.setSelection(src, s, true, false);
        }
    },
    /**
     * Moves back one selection in the browsing history,
     * and updates the current selection.
     * @param src the source of the selection change
     */
    back : function(src) {
        var s = this.hist.back();
        if (s !== null) {
            this.setSelection(src, s, true, false);
        }
    }
};

/**
 * Provides a web-browser-like &quot;history&quot; of
 * selected sets.
 * @author crispy
 */
function History() {
    this.past = []; /** The list of sets in the history */
    this.curr = 0;  /** Index of the current set */
    this.clear();
}

History.MAX = 100;  /** Maximum number of sets to retain */

History.prototype = {
    constructor : History,
    /**
     * Clears the browsing history.
     */
    clear : function() {
        this.past = [];
        this.curr = -1;
    },
    /**
     * Indicates whether or not a previous set exists.
     * @return true if there is a previous set, otherwise false
     */
    hasPrev : function() {
        return this.curr > 0;
    },
    /**
     * Indicates whether or not a next set exists.
     * @return true if there is a next set, otherwise false
     */
    hasNext : function() {
        return this.curr < this.past.length - 1;
    },
    /**
     * Returns the previous set in this history, and updates
     * the current set index.
     * @return the previous set
     */
    back : function() {
        if (!this.hasPrev()) {
            return null;
        } else {
            this.curr--;
            var s = this.past[this.curr];
            return s;
        }
    },
    /**
     * Returns the next set in this history, and updates
     * the current set index.
     * @return the next set
     */
    forward : function() {
        if (!this.hasNext()) {
            return null;
        } else {
            this.curr++;
            return this.past[this.curr];
        }
    },
    /**
     * Adds a set to the browsing history, eliminating the oldest
     * set if capacity has been reached.
     * @param s the set to add { SortedSet<Gene> }
     */
    add : function(s) {
        if (this.curr == History.MAX-1) {
            this.past.splice(0,1);
        } else {
            // TODO: @Dennis try implementing this alternative.
            /**
             * var numOfElements = this.past.length - this.curr - 1;
             * this.past.splice(curr+1, numOfElements);
             */
            for (var i = this.past.length; i > this.curr; i--) {
                this.past.splice(i, 1);
            }
        }

        var t = new TreeSet();
        t.addAll(s);
        this.past.push(t);
        this.curr++;
    }
};

module.exports = GeneList;