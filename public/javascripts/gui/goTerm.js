"use strict";

const SortedSet = require('collections/sorted-set');

const CompareScore = require('./go/compareScore');
const CompareName = require('./go/compareName');
const CompareCount = require('./go/compareCount');

const Term = require('../genes/term');

function GoTerm(genes, fd) {
    this.genes = genes;         /** {GeneList} Temporary flag: set true to use only associated gene count in z-scores, false to use all genes */
    this.terms = {};            /** {Hashtable<String, Term>} All DAG nodes */
    this.geneToGo = {};         /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct associations */
    this.geneToGoIndir = {};    /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct and indirect associations */
    this.nodes = [];            /** {Vector<DefaultMutableTreeNode>} All tree nodes. */
    this.roots = new SortedSet();          /** {TreeSet<Term>} All roots of GO term DAG */
    this.uniq = new SortedSet();           /** {TreeSet<Term>} Unique GO terms in DAG - currently terms w/ direct gene associations only */
    this.all = new SortedSet();            /** {TreeSet<Term>} All GO terms in DAG, both direct and indirect */
    this.assocGenes = new SortedSet();     /** {TreeSet<Gene>} All genes w/ GO term assocations */
    this.tree = null;           /** {JTree} GO term hierarchy display component */
    this.shortList = null;      /** {JList} GO term list display component */
    this.treeModel = null;      /** {DefaultTreeModel} Tree data model - same model is used over entire life of tree */
    this.listModel = null;      /** {GOListModel} List data model - used over entire life of tree */
    this.expandB = document.getElementById('expandB');  /** {JButton} GO hierarchy expand all button */
    this.collapseB = document.getElementById('goCollapseB');    /** {JButton} GO hierarchy collapse all button */
    this.statusF = document.getElementById('goStatusF');    /** {JTextField} Status display field */
    this.copyB = document.getElementById('goCopyB');    /** {JButton} Short list copy button */
    this.sortB = document.getElementById('sortB');      /** {JComboBox} Term list sort pull-down */
    this.collapseT = document.getElementById('goCollapseT');    /** {JToggleButton} GO list collapse toggle */
    this.threshB = document.getElementById('threshB');  /** {JButton} Gene count threshold set button */
    this.geneThresh = 0;        /** {int} Gene count threshold for inclusion in short list */
    this.threshM = document.getElementById('threshM');  /** {JPopupMenu} Gene threshold choice menu */
    this.listLeafT = document.getElementById('listLeafT');  /** {JToggleButton} GO list show leaves only toggle */
    this.listAllT = document.getElementById('listAllT');    /** {JToggleButton} GO list show all nodes toggle */
    this.findF = document.getElementById('goFindF');    /** {JTextField} text box for search */
    this.findB = document.getElementById('goFindB');    /** {JButton} button for find */
    this.findD = document.getElementById('findD');      /** {JInternal Frame} dialog for find results */
    this.results = null;    /** {SearchResults} search results display component */
    this.highTerm = null;   /** {Term} term to highlight in short list */
    this.multi = false;     /** {boolean} Multi-select operation indicator - true if in multi-select */
    this.listM = document.getElementById('listM');  /** {JPopupMenu} Menu of options for list term right-click */
    this.locateM = document.getElementById('locateM');  /** {JMenu} List of hierarchy terms matching list term */
    this.collapsed = false; /** {boolean} GO term list collapse flag */
    this.lastRowList = -1;  /** {Last row click in GO term list, for range select */
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
        const comparator = GoTerm.sortComp[this.sortB.selectedIndex];
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