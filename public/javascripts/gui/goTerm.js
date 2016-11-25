/**
* goTerm corresponds to GO Term Frame
* @author RajahBimmy, modified by radhikamattoo
**/
"use strict";

const SortedSet = require('collections/sorted-set');
// const Clipboard = require('clipboard');
const Controls = require("./controls");
const CompareScore = require('./go/compareScore');
const CompareName = require('./go/compareName');
const CompareCount = require('./go/compareCount');
const SearchResults = require('./go/searchResults');
const Set = require("collections/set");

const TreeModel = require('./go/treeModel');
const TreeNode = require('./go/treeNode');
const TreePath = require('./go/treePath');

const GeneEvent = require('../genes/geneEvent');
const Term = require('../genes/term');

function GoTerm(genes, fd) {
	this.debug = true;

    this.genes = genes;     /** {GeneList} Temporary flag: set true to use only associated gene count in z-scores, false to use all genes */
    this.geneThresh = 1;    /** {number} Gene count threshold for inclusion in short list */
    this.multi = false;     /** {boolean} Multi-select operation indicator - true if in multi-select */
    this.collapsed = false; /** {boolean} GO term list collapse flag */
    this.lastRowList = -1;  /** {number} Last row click in GO term list, for range select */
		this.justNarrowed = false;

    this.terms = new Map();             /** {Map} String => Term All DAG nodes */
    this.uniq = new SortedSet();        /** {SortedSet} of Terms. Unique GO terms in DAG - currently terms w/ direct gene associations only */
    this.all = new SortedSet();         /** {SortedSet} of Terms. All GO terms in DAG, both direct and indirect */
    this.assocGenes = new SortedSet();  /** {SortedSet} of Genes. All genes w/ GO term assocations */
		this.selectedShortTerms = new Set();			 /** {Set} of Term HTML li objects. When a Gene or Vessel or GO Term is selected, this set is updated to reflect which Terms are selected*/
    this.treeModel = new TreeModel();           /** {TreeModel} Tree data model - same model is used over entire life of tree */

    this.listModel = new GOListModel();      /** {GOListModel} List data model - used over entire life of tree */

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
    this.listLeafT.value = false;
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
    this.sortB = document.getElementById('goSortB');          /** Combo Box Term list sort pull-down */

    // TODO: Figure out what's going on here.
    this.locateM = document.getElementById('locateM');  /** List of hierarchy terms matching list term */
    this.listM = document.getElementById('listM');      /** Menu of options for list term right-click */
    this.findD = fd;                                    /** dialog for find results */
    this.results = new SearchResults(genes, this);      /** {SearchResults} search results display component */

    // this.tree.addEventListener('click', this.clearSelectionRecursive.bind(this.tree), false);
    // this.shortList.addEventListener('click', this.clearSelectionRecursive.bind(this.shortList), false);

    this.expandB.addEventListener('click', this.expandTree.bind(this, true), false);
    this.collapseB.addEventListener('click', this.expandTree.bind(this, false), false);
		this.sortB.addEventListener('change', this.updateSort.bind(this), false);
		this.findB.addEventListener('click', this.findA.bind(this), false);
	// TODO: Add findA to findF
	// TODO: Refactor next two lines
		this.collapseT.addEventListener('click', this.setCollapsed.bind(this), false);
		this.listLeafT.addEventListener('click', this.updateShortList.bind(this), false);
		this.listAllT.addEventListener('click', this.updateShortList.bind(this), false);
		// TODO: Update copyB's value based on selected Terms
		// const clipboard = new Clipboard(this.copyB, {
		// 	text : function(trigger) {
		// 		return trigger.getAttribute('value');
		// 	}
		// });

		this.genes.addGeneListener(this);
		this.genes.addMultiSelect(this);

    this.geneToGo = new Map();         /** Gene => Array of Terms. GO term lookup by gene, for direct associations */
    this.geneToGoIndir = new Map();    /** Gene => Array of Terms. GO term lookup by gene, for direct and indirect associations */
    this.nodes = [];            /** {Vector<DefaultMutableTreeNode>} All tree nodes. */
    this.roots = new SortedSet();          /** {SortedSet} of Terms All roots of GO term DAG */
    this.highTerm = null;   /** {Term} term to highlight in short list */
}

GoTerm.sortOptions = [ "Sort by Z-Score", "Sort by Name", "Sort by Count" ];
GoTerm.sortComp = [ CompareScore, CompareName, CompareCount ];

GoTerm.prototype = {
    constructor : GoTerm,
    cleanup : function() {
    	const it = this.roots.iterate();
	    let next = it.next();
	    while (!next.done) {
	    	it.value.cleanup();
		    next = it.next();
	    }
			this.selectedShortTerms.clear();
	    this.roots.clear();
        this.terms.clear();
        this.geneToGo.clear();
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
        this.roots = new SortedSet(src.getReader().roots);
        this.geneToGo = src.getReader().geneToGo;
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getLeafTerms : function(g) {
        return (this.geneToGo.has(g) ? this.geneToGo.get(g) : []);
    },
    /**
     * @param g {Gene}
     * @returns {Array} of Terms
     */
    getCurrentTerms : function(g) {
        return (this.geneToGoIndir.has(g) ? this.geneToGoIndir.get(g) : []);
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
        const trm = this.terms.values();
	    let nextTerm = trm.next();
	    while (!nextTerm.done) {
	    	const t = nextTerm.value;
		    t.resetStoredCount();
		    //noinspection JSUnresolvedFunction
		    this.assocGenes.addEach(t.getAllGenes());
		    nextTerm = trm.next();
	    }
        // this.assocGenes = this.assocGenes.intersection(this.genes.getActiveSet());
	    //noinspection JSUnresolvedFunction
	    this.assocGenes.forEach((gene) => {
	    	if (!this.genes.getActiveSet().has(gene)) {
	    		this.assocGenes.delete(gene);
		    }
	    });
	    //noinspection JSUnresolvedFunction
	    this.roots.forEach((root) => {
	    	root.updateStoredCount(this.assocGenes);
	    });
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
        const trm = this.terms.values();
	    let next = trm.next();
	    while(!next.done) {
	    	next.value.initUnion();
		    next = trm.next();
	    }
	    //noinspection JSUnresolvedFunction
	    this.roots.forEach((root) => {
	    	root.findUnion(this.genes.getGenesSet());
	    });
    },
    updateGeneTerms : function() {
        this.geneToGoIndir.clear();
        const trm = this.terms.values();
        let cnt = 0;
	    let next = trm.next();
	    while (!next.done) {
	    	const t = next.value;
		    const gi = t.getAllGenes().toArray();
		    gi.forEach((gene) => {
		    	let gv = this.geneToGoIndir.get(gene);
			    if (typeof gv === 'undefined') gv = [];
			    gv.push(t);
			    this.geneToGoIndir.set(gene, gv);
		    });
		    cnt += t.getAllGenes().length;
		    next = trm.next();
	    }
        console.log("total item <==> category associations: " + cnt);
    },
    /**
		 * Highlights the term visually, and sets the new selected set based on this.
     * @param t {Term} object to select
     * @param ctrl {Boolean} multiselect or not
		 * @param li {HTMl} element to highlight
     */
    selectTerm : function(t, ctrl, li) {

			var s = new SortedSet(t.getAllGenes());
			var selectedTerms = this.selectedShortTerms;

	    if (ctrl) {
	        const r = new SortedSet(this.genes.getSelectedSet());
					$(li).addClass('highlight', true);
					//highlight all of its children too
					$('#goList li').each(function(index, obj) {
						if(selectedTerms.has(obj)){
							$(obj).addClass("highlight");
						}
					});
					r.addEach(s);
	        this.genes.setSelection(this, r);

	    } else {
				//highlight the term object and all of its children
				var associatedTerms = this.terms;

	      $('#goList li').each(function(index, obj) {
					if(obj != li && !selectedTerms.has(obj)){
						$(obj).removeClass('highlight', false);
					}
	      });
				this.selectedShortTerms.forEach((li) =>{
					$(li).addClass('highlight', true);
				});

	      this.genes.setSelection(this, s);
	    }
			this.updateActiveGeneCounts();
    },
		/**
		* Un-highlights the term visually, and sets the new selected set based on the selected terms left (if any)
		* @param term {Term} object to visually unhighlight (along with all of its children)
		* @para li {HTML} object to unhighlight
		*/
		deselectTerm : function(term, li){
			//remove the term's associated genes from the current set and
			var selected = new SortedSet(this.genes.getSelectedSet());
			var current = term.getAllGenes();
			current.forEach((gene) =>{
				if(selected.has(gene)){
					selected.delete(gene);
				}
			});

			//remove this term and all its children from the selected group and unhighlight them

			const thisLI = this.findHtmlElement(term);
			thisLI.className = "list-group-item";

			this.recursiveChildUnhighlight(term);
			this.recursiveParentUnhighlight(term);

			//set the new selected set
			this.genes.setSelection(this, selected);

		},
		/**
		* Recursively removes CSS highlight from a child HTML element
		*
		* @param term {Term} object to unhighlight
		*/
		recursiveChildUnhighlight : function(term){
			term.children.forEach((childTerm) =>{
				if(this.listModel.data.has(childTerm)){
					var html = this.findHtmlElement(childTerm);
					html.className = "list-group-item";
					this.recursiveChildUnhighlight(childTerm);
				}
			});
		},
		/**
		* Recursively removes CSS highlight from a parent HTML element
		*
		* @param term {Term} object to unhighlight
		*/
		recursiveParentUnhighlight : function(term){
			term.parents.forEach((parentTerm) =>{
				if(this.listModel.data.has(parentTerm)){
					var html = this.findHtmlElement(parentTerm);
					html.className = "list-group-item";
					this.recursiveParentUnhighlight(parentTerm);
				}
			});

		},

    /**
     * @param t {Number} int
     */
    setGeneThreshold : function(t) {
        this.geneThresh = t;
				this.updateShortList();
				this.updateSelect();
    },
		/**
		* Event handler for changing the sort method in GO Terms.
		* Restructures the GO Term short list based on whatever method is selected
		*/
		updateSort : function(){
			this.updateShortList();
			this.updateSelect();
		},
    /**
     * Updates the short list content and sort order.  Depends
     * on the unique terms list, which is compiled in
     * #trimDAG(SortedSet), and the collapsed state.
     */
    updateShortList : function() {
        // depends on uniq, which is calculated in trimDAG
	    const comparator = GoTerm.sortComp[this.sortB.selectedIndex];
      var test = new SortedSet(null,null,comparator);

        // if (this.collapsed){
        // 	this.updateSelectedState();
				// }
        const shortTermArray = this.getShortTerm();
	    	shortTermArray.forEach((t) => {
					if (t.getStoredCount() >= this.geneThresh && ((t.getSelectedState() == Term.STATE_SELECTED && this.collapsed) || this.collapsed === false)){
						test.push(t);
					}
	    	});
        this.listModel.setListData(test); //this sets what Terms will show up visually
        this.statusF.innerHTML = this.genes.getSource().getAttributes().get('categoriesLabel', 'categories') + ": " + this.listModel.getSize();

    },

    findTermMatches : function() {
			const v = [];
			if(this.findF.value === ""){
				this.results.setResults(v);
				return;
			}
			const pattern = ".*" + this.findF.value + ".*";
	    const p = new RegExp(pattern, "i");
	    const shortTermIt = this.getShortTerm().iterator();
	    let it = shortTermIt.next();
	    while (!it.done) {
	    	const t = it.value;
		    if (p.test(t.getName()))
		    	v.push(t);
		    it = shortTermIt.next();
	    }
	    this.results.setResults(v);
    },
    findNodeMatches : function() {
	    const pattern = ".*" + this.findF.value + ".*";
	    const p = new RegExp(pattern, "i");
	    const v = [];
	    this.nodes.forEach((node) => {
	    	const t = node.getUserObject();
		    if (p.test(t.getName()))
		    	v.push(node);
	    });
    },
    getShortTerm : function() {
    	const currentValue = JSON.parse(this.listLeafT.value);
			var count = Object.keys(currentValue).length;
	    // this.listLeafT.value = !currentValue;
      return count > 0 ? this.uniq : this.all;
    },
	/**
	 * @param t {Term}
	 */
	showTerm : function(t) {
		this.highTerm = null;
		for (let i = 0; i < this.listModel.getSize(); i++) {
			if (this.listModel.getElementAt(i) == t) {
				// ensure index is visible?
				this.highTerm = t;
				break;
			}
		}
		// repaint?
	},
	showNode : function(n) {
		const p = new TreePath(n.getPath());
		// TODO: Finish implementation.
	},
	getHighTerm : function() {
		return this.highTerm;
	},
	showLocateMenu : function(match, comp, x, y) {
		// TODO: Figure this out
	},
	makeTree : function() {
		const t = new SortedSet();
		//noinspection JSUnresolvedFunction
		t.addEach(this.genes.getSelectedSet());
		this.trimDAG(t);
		this.synchronizeTreeToDAG(this.treeModel.getRoot(), this.roots);
		this.updateShortList();
	},
	/**
	 * @param expand {boolean}
	 */
	expandTree : function(expand) {
		const rt = this.treeModel.getRoot();
		const e = rt.postorderEnumeration();
		const items = this.tree.getElementsByTagName("li");
		e.forEach((n) => {
			if (expand) {
				// TODO: Something
			} else {
				if (n != rt) {
					// TODO: Something
				}
			}
		});

	},
	/**
	 * Determines the active terms in the GO term DAG based on the current
	 * set of selected genes.
	 * @param s {SortedSet} the currently selected genes
	 */
	trimDAG : function (s) {
		// deselect all terms
		const e = this.terms.values();
		let nextTerm = e.next();
		while (!nextTerm.done) {
			nextTerm.value.setActive(false);
			nextTerm = e.next();
		}
		const gi = s.iterate();
		this.uniq.clear();
		this.all.clear();
		// for each gene...
		let next = gi.next();
		while (!next.done) {
			const g = next.value;
			// ...get its go terms..
			const v = this.getLeafTerms(g);
			if (v !== null) {
				// ...and mark each term and its parents selected
				v.forEach((term) => {
					this.uniq.add(term);
					this.all.add(term);
					this.traceParent(term);
				});
			}
			next = gi.next();
		}
	},
	/**
	 * @param t {Term}
	 */
	traceParent : function(t) {
		if (!t.isActive()) {
			t.setActive(true);
			this.all.push(t);
			const parentIter = t.getParents().iterate();
			let next = parentIter.next();
			while (!next.done) {
				this.traceParent(next.value);
				next = parentIter.next();
			}
		}
	},
	/**
	 * Toggles the GO term list collapsed state, and updates
	 * its display.
	 * @param b {boolean} true to collapse list, otherwise false
	 */
	setCollapsed : function(b) {
		this.collapsed = !this.collapsed;
		this.findF.value = "";

		this.setActiveTerms();
		this.updateShortList();
		this.updateSelect();
	},
	/**
	 * Updates the selected state of all the GO terms.
	 */
	updateSelectedState : function() {
		const termsIt = this.terms.values();
		let nextTerm = termsIt.next();
		while (!nextTerm.done) {
			nextTerm.value.initSelectedState();
			nextTerm = termsIt.next();
		}
		//noinspection JSUnresolvedFunction
		this.roots.forEach((root) => {
			root.updateSelectedState(this.genes.getSelectedSet());
		});
	},
	/**
	 * Updates the display when the selected set changes.
	 */
	updateSelect : function() {
		//set up new short list
		this.setShortListListeners();

		//set up new hierarchy list
		this.populateTreeRecursive(this.treeModel.getRoot(), this.tree);
	},
	lostOwnership : function(c, t) { },
	copyTerms : function() {
		const comparator = GoTerm.sortComp[this.sortB.selectedIndex];
		const test = new SortedSet(null,null,comparator);
		this.updateSelectedState();
		const termIt = this.getShortTerm().iterate();
		let nextTerm = termIt.next();
		while (!nextTerm.done) {
			const t = nextTerm.value;
			if (t.getSelectedState() == Term.STATE_SELECTED) test.push(t);
			nextTerm = termIt.next();
		}
		let b = "";
		const testIt = test.iterate();
		let nextTest = testIt.next();
		while (!nextTest.done) {
			const t = nextTest.value;
			b += t.toString() + "\n";
			nextTest = testIt.next();
		}
		this.copyB.value = b;
	},
	/**
	 * Synchronizes the hierarchy with the active nodes in the DAG.
	 * The parent parameter's children are synchronized with the passed collection,
	 * and this process is continued recursively for the children.
	 *
	 * @param parent {TreeNode} the parent node at which to start synchronizing
	 * @param terms {SortedSet} the list of nodes with which the parent's children will be synchronized
	 */
	synchronizeTreeToDAG : function(parent, terms) {
		const tit = terms.iterate();
		let idx = 0;
		let next = tit.next();
		while (!next.done) {
			const t = next.value;
			if (t.isActive()) {
				if (idx >= parent.getChildCount() || t != parent.getChildAt(idx).getUserObject())
					this.treeModel.insertNodeInto(new TreeNode(t), parent, idx);
				idx++;
			} else {
				if (idx < parent.getChildCount() && t == parent.getChildAt(idx).getUserObject())
					this.treeModel.removeNodeFromParent(parent.getChildAt(idx));
			}
			next = tit.next();
		}
		for (let i = 0; i < parent.getChildCount(); i++) {
			const n = parent.getChildAt(i);
			this.synchronizeTreeToDAG(n, n.getUserObject().getChildren());
		}
	},
	/**
	 * Builds the displayed tree from the DAG.  Nodes with multiple
	 * parents are represented as repeated sub-graphs in the tree.
	 */
	makeTreeFromDAG : function() {
		const t = new SortedSet();
		//noinspection JSUnresolvedFunction
		t.addEach(this.genes.getSelectedSet());
		this.trimDAG(t);
		const cL = this.genes.getSource().getAttributes().get("categoriesLabel", "categories");
		const root = new TreeNode(this.capFirst(cL));
		this.nodes = [];
		const rt = this.roots.iterate();
		let next = rt.next();
		while (!next.done) {
			this.addNodes(root, next.value);
			next = rt.next();
		}
		this.treeModel.setRoot(root);
	},
    addNodes : function(r, n) {
        if (n.isActive()) {
        	const curr = new TreeNode(n);
	        r.add(curr);
	        this.nodes.push(curr);
	        const it = n.getChildren().iterate();
	        let next = it.next();
	        while (!next.done) {
	        	this.addNodes(curr, next.value);
		        next = it.next();
	        }
        }
    },
    listUpdated : function(e) {
        switch (e.getType()) {
            case GeneEvent.NEW_SOURCE:
            	console.log("New source!");
                this.set(this.genes.getSource());
                break;
            case GeneEvent.NEW_LIST:
	            $("#findD").modal('hide');
								this.justNarrowed = false;
                this.findGeneUnions();
                this.updateGeneTerms();
                this.updateActiveGeneCounts();
                this.makeTreeFromDAG();
                this.makeTree();
                this.updateGUI();
	            	this.copyTerms();
	            	this.setShortListListeners();
	            	this.populateTreeRecursive(this.treeModel.getRoot(), this.tree);
                break;
            case GeneEvent.RESTART:
							this.justNarrowed = false;
							this.findGeneUnions();
							this.updateGeneTerms();
							this.updateActiveGeneCounts();
							this.makeTreeFromDAG();
							this.makeTree();
							this.updateGUI();
							this.copyTerms();
							this.selectedShortTerms.clear();
							this.setGeneThreshold(1);
							this.populateTreeRecursive(this.treeModel.getRoot(), this.tree);
            case GeneEvent.NARROW:
								this.justNarrowed = true;
	            	$("#findD").modal('hide');
                this.highTerm = null;
                this.updateActiveGeneCounts();
                // this.makeTree();
								this.findGeneUnions();
								this.updateGeneTerms();

								//reset all terms
								this.terms.forEach((term) =>{
									this.recursiveDeactivate(term);
								});
								this.selectedShortTerms.clear();
								this.setGeneThreshold(1);
	            	this.copyTerms();
                break;
            case GeneEvent.SELECT:
							if(e.getSource() !== this){
								this.findGeneUnions();
								this.updateGeneTerms();
								this.updateActiveGeneCounts();
								this.selectedShortTerms.clear();
									if(e.getSource() instanceof Controls){
										console.log("Controls event!");
										// this.makeTreeFromDAG();
										// this.makeTree();
										this.updateGUI();
										this.copyTerms();
										this.setActiveTerms();
										this.setGeneThreshold(1);
										// this.populateTreeRecursive(this.treeModel.getRoot(), this.tree);
									}else{
										console.log("Event source isn't go term or controls!");
										this.setActiveTerms();
										this.setGeneThreshold(1);
										this.copyTerms();
									}

							}
                break;
            case GeneEvent.MULTI_START:
                this.setMulti(true);
                break;
            case GeneEvent.MULTI_FINISH:
                this.setMulti(false);
	            this.copyTerms();
                break;
        }
    },
		/**
		* Sets the selected terms based on currently selected genes.
		* This is only called when a select event is triggered by something other than an item in the GO Term container
		*/
		setActiveTerms : function(){
			//this is when the back arrow is pressed all the way back to the original set. in this case, we don't highlight anything
			var selected = this.genes.getSelectedSet().size;
			var active = this.genes.getActiveSet().size;

			if((!this.genes.hasPrev() && !this.justNarrowed) || (selected == active)){
				this.collapsed = false;
				this.selectedShortTerms.clear();
				return;
			}

			if(this.justNarrowed == true){
				this.justNarrowed = false;
			}
			//otherwise figure out which terms should be selected
			this.terms.forEach((term) =>{
				if(term.getSelectedState() == Term.STATE_SELECTED){
					return;
				}
				this.recursiveSet(term);
			});
		},
		recursiveSet : function(term){
			if(term.selectedState == Term.STATE_SELECTED){
				return;
			}
			this.genes.getSelectedSet().forEach((selected) =>{
				if(term.localGenes.has(selected)){
					term.selectedState = Term.STATE_SELECTED;
					this.selectedShortTerms.add(this.findHtmlElement(term));
					this.recursiveActivate(term);
				}else{
					term.children.forEach((child) =>{
						this.recursiveSet(child);
					});
				}
			});
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

	findA : function() {
    this.findTermMatches();
		if (this.results.getMatchCount() == 0) {
			const cL = this.genes.getSource().getAttributes().get("categoriesLabel", "categories");
			alert("No matching " + cL + " found");
		}else{
			$("#findD").modal('show');
		}
	},

	populateTreeRecursive : function(node, element) {
		while (element.hasChildNodes()) {
			element.removeChild(this.tree.firstChild);
		}
		node.children.forEach((child) => {
			const li = document.createElement('li');
			const term = child.getUserObject();
			li.innerHTML = term.toString();
			li.className = (term.isActive() ? 'selected' : '');
			element.appendChild(li);
			if (child.children.length > 0) {
				const ul = document.createElement('ul');
				this.populateTreeRecursive(child, ul);
				element.appendChild(ul);
			}
		});
	},

  setShortListListeners : function() {
	    while (this.shortList.hasChildNodes()) {
		    this.shortList.removeChild(this.shortList.firstChild);
	    }
	    let i = 0;
        this.listModel.data.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = item.toString();
						if(item.getSelectedState() == Term.STATE_SELECTED && !this.collapsed){
							li.className = "list-group-item highlight";
						}else{
							li.className = "list-group-item";
						}

            li.addEventListener('click', () => {
                // if (!this.multi && i > -1) {
                    // if (false) {
                    //     // if it is a popup trigger
                    // } else {
											var li = this.findHtmlElement(item);

                        if (window.event.altKey) {
                            this.genes.startMultiSelect(this); //notifies all gene listeners for MULTI_START
                        } else {
                            if (this.lastRowList != -1 && window.event.shiftKey) {
                                let s = new SortedSet();
                                const sublist = this.listModel.data.splice(Math.min(i, this.lastRowList), Math.max(i, this.lastRowList)+1);
                                sublist.forEach((item) => {
																		item.selectedState = Term.STATE_SELECTED;
																		this.selectedShortTerms.add(li);
                                    //noinspection JSUnresolvedFunction
                                    s.addEach(item.getAllGenes());
                                });
                                this.genes.setSelection(this, s);
                            } else {

																if(this.selectedShortTerms.has(li)){ //deselect this and all of its children
																	console.log("Unselecting!");
																	li.selectedState = Term.STATE_UNKNOWN;
																	if(this.selectedShortTerms.has(li)){
																		this.selectedShortTerms.delete(li);
																	}
																	this.recursiveDeactivate(item);
																	this.deselectTerm(item, li);

																}else{ //SELECT this term and all its children
																	console.log("Selecting!");

																	//reset all highlights!
																	if(!window.event.ctrlKey && !window.event.metaKey){
																		this.selectedShortTerms.clear();
																		this.terms.forEach((term) =>{
																			term.initSelectedState();
																		});
																	}
																	item.selectedState = Term.STATE_SELECTED;
																	this.selectedShortTerms.add(li);
																	this.recursiveActivate(item); //set the selected state of its children and add to selected terms set
																	this.selectTerm(item, window.event.ctrlKey || window.event.metaKey, li);
																}

                        }
                        if (!window.event.shiftKey) this.lastRowList = i;
                    }
                // }
            }, false);
            this.shortList.appendChild(li);
	        i++;
        });
    },
		/**
		* Sets the term's selected state to SELECTED, adds its HTML element to the selected set,
		* and recursively does the same for all the term's children
		* @param item {Term} object to select
		*
		*/
		recursiveActivate : function(item){
			if(item.children.size > 0){
				item.children.forEach((child) =>{
					if(this.listModel.data.has(child)){
						child.selectedState = Term.STATE_SELECTED;
						this.selectedShortTerms.add(this.findHtmlElement(child));
						this.recursiveActivate(child); //now activate all of its children.
					}
				});
			}
			if(item.parents.size > 0){
				item.parents.forEach((parent) =>{
					this.recursiveActivateParent(parent);
				});
			}
			return;
		},
		/**
		* If all a parent term's children are selected select the parent term too.
		*
		* @param parent {Term} node to check if we have to activate
		*/
		recursiveActivateParent : function(parent){

			parent.selectedState = Term.STATE_SELECTED;
			this.selectedShortTerms.add(this.findHtmlElement(parent));
			if(parent.parents.size > 0){
				parent.parents.forEach((superParent) =>{
					this.recursiveActivateParent(superParent);
				});
			}

			return;

		},
		/**
		* Sets the term's selected state to UNKOWN, removes its HTML element from the selected set,
		* and recursively does the same for all the term's children.
		* @param item {Term} object to deselect
		*/
		recursiveDeactivate : function(item){
			if(item.children.size > 0){
				item.children.forEach((child) =>{
					if(this.listModel.data.has(child)){
						child.selectedState = Term.STATE_UNKNOWN;
						var childElement = this.findHtmlElement(child);
						if(this.selectedShortTerms.has(childElement)){
							this.selectedShortTerms.delete(childElement);
						}
						this.recursiveDeactivate(child); //now deactivate all of its children.
					}

				});
			}
			if(item.parents.size > 0){ //also have to deactivate its parents
				item.parents.forEach((parent) =>{
					this.recursiveDeactivateParent(parent);
				});
			}
			return;
		},
		/**
		* This function deactivates a parent term and all its respective parent terms.
		* This is used when someone deselects a child term, so we have to deselect its parent terms as well, because its not all-inclusive anymore
		* @param parent {Term} parent object to recursively deselect
		*
		*/
		recursiveDeactivateParent : function(parent){
			parent.selectedState = Term.STATE_UNKNOWN;
			if(this.listModel.data.has(parent)){
				var parentElement = this.findHtmlElement(parent);
				if(this.selectedShortTerms.has(parentElement)){
					this.selectedShortTerms.delete(parentElement);
				}
			}
			if(parent.parents.size > 0){
				parent.parents.forEach((superParent) =>{
					this.recursiveDeactivateParent(superParent);
				});
			}
		},
		/**
		* Finds html LI element for a term object.
		*
		**/
		findHtmlElement : function(term){
			var li;
			$('#goList li').each(function(index, obj) {
				if(obj.innerHTML === term.toString()){
					li = obj;
				}
			});
			return li;
		},
	capFirst : function(s) {
		if (s.length > 1) {
			return s[0].toUpperCase();
		} else if (s.length == 1) {
			return s.toUpperCase();
		} else {
			return s;
		}
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
