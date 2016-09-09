"use strict";

const SortedSet = require('collections/sorted-set');

const CompareScore = require('./go/compareScore');
const CompareName = require('./go/compareName');
const CompareCount = require('./go/compareCount');
const SearchResults = require('./go/searchResults');
const TreeModel = require('./go/treeModel');

const GeneEvent = require('../genes/geneEvent');
const Term = require('../genes/term');

function GoTerm(genes, fd) {
    this.genes = genes;     /** {GeneList} Temporary flag: set true to use only associated gene count in z-scores, false to use all genes */
    this.geneThresh = 1;    /** {number} Gene count threshold for inclusion in short list */
    this.multi = false;     /** {boolean} Multi-select operation indicator - true if in multi-select */
    this.collapsed = false; /** {boolean} GO term list collapse flag */
    this.lastRowList = -1;  /** {number} Last row click in GO term list, for range select */

    this.terms = new Map();             /** {Map} String => Term All DAG nodes */
    this.uniq = new SortedSet();        /** {SortedSet} of Terms. Unique GO terms in DAG - currently terms w/ direct gene associations only */
    this.all = new SortedSet();         /** {SortedSet} of Terms. All GO terms in DAG, both direct and indirect */
    this.assocGenes = new SortedSet();  /** {SortedSet} of Genes. All genes w/ GO term assocations */

    this.treeModel = new TreeModel(null);           /** {TreeModel} Tree data model - same model is used over entire life of tree */

    this.listModel = new GOListModel();      /** {GOListModel} List data model - used over entire life of tree */

    // TESTING
    this.tree = document.getElementById('goTree');              /** GO term hierarchy display component */
    this.shortList = document.getElementById('goList');         /** GO term list display component */

    this.expandB = document.getElementById('goExpandB');        /** GO hierarchy expand all button */
    this.expandB.title = "Show all categories in the hierarchy";
    this.collapseB = document.getElementById('goCollapseB');    /** GO hierarchy collapse all button */
    this.collapseB.title = "Hide all non-root categories in the hierarchy";
    this.findF = document.getElementById('goFindF');            /** text box for search */
    this.findB = document.getElementById('goFindB');            /** button for find */
    this.findB.title = "Display all categories matching the search text";
    this.collapseT = document.getElementById('goCollapseT');    /** GO list collapse toggle */
    this.collapseT.title = "Toggles collapsing list to selected categories only";
    this.listLeafT = document.getElementById('goListLeafT');    /** GO list show leaves only toggle */
    this.listAllT = document.getElementById('goListAllT');      /** GO list show all nodes toggle */
    this.listLeafT.title = "Show direct associations only";
    this.listAllT.title = "Show all associations.";
    this.threshB = document.getElementById('goThreshB');    /** Gene count threshold set button */
    this.threshM = document.getElementById('threshM');      /** Gene threshold choice menu */

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement('li');
        row.innerHTML = i;
        row.value = i;
        row.addEventListener('click', () => this.setGeneThreshold(row.value), false);
        this.threshM.appendChild(row);
    }

    this.statusF = document.getElementById('goStatusF');    /** Status display field */
    this.copyB = document.getElementById('goCopyB');        /** Short list copy button */
    this.copyB.title = "Copy the current  selected categories to the clipboard";
    this.sortB = document.getElementById('sortB');          /** Combo Box Term list sort pull-down */

    // TODO: Figure out what's going on here.
    this.locateM = document.getElementById('locateM');  /** List of hierarchy terms matching list term */
    this.listM = document.getElementById('listM');      /** Menu of options for list term right-click */
    this.findD = fd;                                    /** dialog for find results */
    this.results = new SearchResults(genes, this);      /** {SearchResults} search results display component */

    // TODO: Right now it wipes all selections, should wipe all but the one clicked.
    // this.tree.addEventListener('click', this.clearSelectionRecursive.bind(this.tree), false);
    // this.shortList.addEventListener('click', this.clearSelectionRecursive.bind(this.shortList), false);

    this.geneToGo = new Map();         /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct associations */
    this.geneToGoIndir = new Map();    /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct and indirect associations */
    this.nodes = [];            /** {Vector<DefaultMutableTreeNode>} All tree nodes. */
    this.roots = new SortedSet();          /** {TreeSet<Term>} All roots of GO term DAG */
    this.highTerm = null;   /** {Term} term to highlight in short list */
}

GoTerm.sortOptions = [ "Sort by Z-Score", "Sort by Name", "Sort by Count" ];
GoTerm.sortComp = [ CompareScore, CompareName, CompareCount ];

GoTerm.prototype = {
    constructor : GoTerm,
    cleanup : function() {
        for (let it = 0; it < this.roots.length; it++) {
            this.roots[it].cleanup();
        }
        this.terms = {};
        this.geneToGo = {};
        this.uniq.clear();
        this.all.clear();
        this.assocGenes.clear();
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
        const v = this.geneToGo.get(g);
        return (v === null) ? [] : v;
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getCurrentTerms : function(g) {
        const v = this.geneGoIndir.get(g);
        return (v === null) ? [] : v;
    },
    updateGUI : function() {
        const iL = this.genes.getSource().getAttributes().get("itemsLabel", "items");
        this.threshB.title = "Set threshold for active " + iL + " count";
        const cL = this.genes.getSource().getAttributes().get("categoriesLabel", "categories");
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
        this.assocGenes.clear();
        let trm = this.terms.keys();
        for (let i = 0; i < trm.length; i++) {
            const t = this.terms[trm[i]];
            t.resetStoredCount();
            this.assocGenes = this.assocGenes.union(t.getAllGenes().toArray());
        }
        this.assocGenes = this.assocGenes.intersection(this.genes.getActiveSet().toArray());
        const rootsArray = this.roots.toArray();
        for (let i = 0; i < rootsArray.length; i++) {
            // TODO: Check that this works.
            rootsArray[i].updateStoredCount(this.assocGenes);
        }
    },
    /**
     * Initiates the recursive process of determining the full set of genes
     * represented by each node and its descendents.  This is necessary since
     * a gene is not associated with all its ancestor terms in the GO
     * hierarchy, so the resulting process is basically a DFS union across
     * all children.  This routine is called only when the backing gene list
     * is changed.
     */
    findGeneUnions : function() {
        let trm = this.terms.keys();
        for (let i = 0; i < trm.length; i++) {
            this.terms[trm[i]].initUnion();
        }
        const rootsArray = this.roots.toArray();
        for (let i = 0; i < rootsArray.length; i++) {
            // TODO: Check that this works.
            rootsArray[i].findUnion(this.genes.getGenesSet());
        }
    },
    updateGeneTerms : function() {
        this.geneToGoIndir = {};
        const trm = this.terms.keys();
        let cnt = 0;
        for (let i = 0; i < trm.length; i++) {
            const t = this.terms[trm[i]];
            let gi = t.getAllGenes().toArray();
            for (let j = 0; j < gi.length; j++) {
                const g = gi[j]; //oe
                let gv = this.geneToGoIndir[g];
                if (typeof gv === 'undefined' || gv === null) {
                    gv = [];
                }
                gv.push(t);
                this.geneToGoIndir[g] = gv;
            }
            cnt += t.getAllGenes().length;
        }
        console.log("total item <==> category associations: " + cnt);
    },
    /**
     * @param t {Term}
     * @param ctrl {boolean}
     */
    selectTerm : function(t, ctrl) {
        let s = t.getAllGenes();
        s = s.intersection(this.genes.getSelectedSet().toArray());
        if (ctrl) {
            let r = this.genes.getSelectedSet();
            if (s.length > 0) {
                const sArray = s.toArray();
                for (let i = 0; i < sArray.length; i++) {
                    if (r.contains(sArray[i])) {
                        r.remove(sArray[i]);
                    }
                }
            } else {
                r = r.union(t.getAllGenes().toArray());
            }
            this.genes.setSelection(this, r);
        } else {
            s = t.getAllGenes();
            s = s.intersection(this.genes.getActiveSet().toArray());
            this.genes.setSelection(this, s);
        }
    },
    /**
     * @param t {Number} int
     */
    setGeneThreshold : function(t) {
        this.geneThresh = t;
        this.updateShortList();
    },
    /**
     * Updates the short list content and sort order.  Depends
     * on the unique terms list, which is compiled in
     * #trimDAG(SortedSet), and the collapsed state.
     */
    updateShortList : function() {
        // depends on uniq, which is calculated in trimDAG
        const test = new SortedSet();
        const comparator = GoTerm.sortComp[this.sortB.options[this.sortB.selectedIndex]];
        if (this.collapsed) {
            this.updateSelectedState();
        }
        const shortTermArray = this.getShortTerm();
        for (let i = 0; i < shortTermArray.length; i++) {
            const t = shortTermArray[i];
            if (t.getStoredCount() >= this.geneThresh && (!this.collapse || t.getSelectedState() == Term.STATE_SELECTED)) {
                test.push(t);
            }
        }
        const testArray = test.sorted(comparator);
        // TODO: Check this.
        this.listModel.setListData(testArray);
        this.statusF.innerHTML = this.genes.getSource().getAttributes().get('categoriesLabel', 'categories') + ": " + this.listModel.getSize();
    },
    findTermMatches : function() {
        // TODO: Implement me.
    },
    findNodeMatches : function() {
        // TODO: Implement me.
    },
    getShortTerm : function() {
        return this.listLeafT.isSelected() ? this.uniq : this.all;
    },
    addNodes : function(r, n) {
        if (n.isActive()) {
            // TODO: Figure out jsTree
        }
    },
    listUpdated : function(e) {
        switch (e.getType()) {
            case GeneEvent.NEW_SOURCE:
                this.set(this.genes.getSource());
                break;
            case GeneEvent.NEW_LIST:
                // TODO: this.findD shouldn't be visible.
                this.findGeneUnions();
                this.updateGeneTerms();
                this.updateActiveGeneCounts();
                console.log("associated terms: " + this.assocGenes.length);
                this.makeTreeFromDAG();
                this.makeTree();
                this.updateGUI();
                break;
            case GeneEvent.RESTART:
                break;
            case GeneEvent.NARROW:
                // TODO: this.findD shouldn't be visible.
                this.highTerm = null;
                this.updateActiveGeneCounts();
                this.makeTree();
                this.updateSelect();
                break;
            case GeneEvent.SELECT:
                if (this.collapsed) this.updateShortList();
                this.updateSelect();
                break;
            case GeneEvent.MULTI_START:
                this.setMulti(true);
                break;
            case GeneEvent.MULTI_FINISH:
                this.setMulti(false);
                break;
        }
    },

    getMultiSelection : function(operation) {
        // TODO: Implement.
    },

    setMulti : function(b) {
        this.multi = b;
        if (b) {
            // TODO: Implement
        } else {
            // TODO: Implement
        }
    },

    shortListListener : function(index) {

    },
    clearSelectionRecursive : function(el) {
        el.childNodes.forEach((child) => {
            if (child.childNodes.length > 0) {
                this.clearSelectionRecursive(child);
            }
            child.className = "";
        });
    }
};

function GOListModel() {
    this.data = [];
}

GOListModel.prototype = {
    constructor : GOListModel,
    clear : function() {
        this.data = [];
    },
    setListData : function(c) {
        const s = this.data.length;
        this.data = c;
    },
    getSize : function() {
        return this.data.length;
    },
    /**
     * @param idx {Number} int
     * @returns {Term}
     */
    getElementAt : function(idx) {
        return this.data[idx];
    }
};

module.exports = GoTerm;