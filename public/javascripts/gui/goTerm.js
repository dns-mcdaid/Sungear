require('javascript.util');
var TreeSet = javascript.util.TreeSet;

function GoTerm(genes, fd) {
    this.genes = genes;         /** {GeneList} Temporary flag: set true to use only associated gene count in z-scores, false to use all genes */
    this.terms = {};            /** {Hashtable<String, Term>} All DAG nodes */
    this.geneToGo = {};         /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct associations */
    this.geneToGoIndir = {};    /** {Hashtable<Gene, Vector<Term>>} GO term lookup by gene, for direct and indirect associations */
    this.nodes = [];            /** {Vector<DefaultMutableTreeNode>} All tree nodes. */
    this.roots = null;          /** {TreeSet<Term>} All roots of GO term DAG */
    this.uniq = null;           /** {TreeSet<Term>} Unique GO terms in DAG - currently terms w/ direct gene associations only */
    this.all = null;            /** {TreeSet<Term>} All GO terms in DAG, both direct and indirect */
    this.assocGenes = null;     /** {TreeSet<Gene>} All genes w/ GO term assocations */
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
    }
};

module.exports = GoTerm;