"use strict";
/**
 * Represents a term in the GO hierarchy.  This class is a little more complicated
 * than one might expect because of the set operations required to support the
 * effecient calculation of z-scores and selection.  Support functions provide
 * recursive set union and intersection size operations.
 *
 * Essentially, {@link #initUnion()} and {@link #findUnion(SortedSet)} are called
 * whenever a new experiment is loaded to update {@link #allGenes}.  From this point
 * on, the number of genes at this node and its descendents can be found by the
 * intersection of {@link #allGenes} with the current selected or active set as
 * appropriate.
 *
 * {@link #storedCount}, which is returned by {@link #getStoredCount()},
 * is an optimization for the calculation of Hypergeometric-Distribution.  Although
 * it's called the stored count, it's only used to represent the size of the intersection
 * of {@link #allGenes} with the active set.  This count is used for the Instantiation of
 * HypergeometricDistribution class after Narrow operations, and determining the fraction
 * of genes selected for this term.
 * This value is recalculated every time a narrow is performed, using the
 * functions {@link #resetStoredCount()} and {@link #updateStoredCount(SortedSet)}.  This
 * much more efficient than determining the intersection size dynamically each time it is
 * needed, primarily because the option to sort by Hyper-Geo Distribution is provided in the interface,
 * which requires that all the probabilities be available after a narrow for the sorting
 * procedure.
 *
 * {@link #getIntersectCount(SortedSet)} is the dynamic version of {@link #getStoredCount()}
 * in that it dynamically determines the size of the intersection set.  It is intended for
 * use on very small sets of terms, such as will fit on one screen in a list component.
 *
 * {@link #selectedState}, which is returned by {@link #getSelectedState()}, is
 * a more effecient way to see if a term (or any of its children) has genes in the
 * selected set.  It is recalculated by calling {@link #initSelectedState()} and
 * {@link #updateSelectedState(SortedSet)}, which is usually done by {@link gui.GoTerm}
 * when the selected set changes while the collapse GO term list option is selected.
 *
 * @author crispy
 * @modifier Rajah_Bimmy
 * Copyright Chris Poultney 2004.
 */

const SortedSet = require("collections/sorted-set");
const HypergeometricDistribution = require("../hyperGeo/distribution/HypergeometricDistribution");

/**
 * Constructs a new GO term.
 * @param id the GO term ID
 * @param name the GO term name
 */
function Term(id, name) {
    this.id = id;           /** @type String GO term ID */
    this.name = name;       /** @type String GO term name */
    this.parents = new SortedSet();       /** This term's parent nodes */
    this.children = new SortedSet();      /** This term's child nodes */
    this.allGenes = new SortedSet();      /** All genes associated with this node and its descendents */
    this.localGenes = new SortedSet();    /** The genes associated strictly with this node */
    this.storedCount = -1;  /** @type int The number of genes in {@link #allGenes} represented in some set, usually the active set */
    this.p_t = 0;           /** @type double z-score calculation term */
    this.active = false;    /** Denotes whether any genes are associated with this term in the current experiment set */
    this.selectedState = Term.STATE_UNKNOWN;    /** @type int */
}

/** Selected state flag: state undetermined */
Term.STATE_UNKNOWN = 0;
/** Selected state flag: term selected (term or descendent has intersection with current selected set) */
Term.STATE_SELECTED = 1;
/** Selected state flag: term not selected */
Term.STATE_UNSELECTED = 2;



Term.H;
Term.Hyp;
Term.Total;

Term.prototype = {
    constructor : Term,
    cleanup : function() {
	    const childIt = this.children.iterate();
	    let next = childIt.next();
	    while (!next.done) {
		    next.value.cleanup();
		    next = childIt.next();
	    }
        this.children.clear();
        this.parents.clear();
        this.allGenes.clear();
        this.localGenes.clear();
    },
	/**
	 * Sets the ratio of the number of genes associated with this term to
	 * the total number of genes in an experiment set.
	 * @param p_t {Number} the fraction of terms represented by this term
	 */
    setRatio : function(p_t) {
        this.p_t = p_t;
    },
    addChild : function(c) {
        this.children.push(c);
    },
    getChildren : function() {
        return this.children;
    },
    addParent : function(p) {
        this.parents.push(p);
    },
    getParents : function() {
        return this.parents;
    },
    addGene : function(g) {
        this.localGenes.push(g);
    },
    isRoot : function() {
        return this.parents.length == 0;
    },
    setActive : function(b) {
        this.active = b;
    },
    isActive : function() {
        return this.active;
    },
    getAllGenes : function() {
        return this.allGenes;
    },
    getId : function() {
        return this.id;
    },
    getName : function() {
        return this.name;
    },
	/**
	 * Calculates the number of genes at this node and its descendents
	 * that are in the intersection with the given set (usually the current
	 * selected set). Unlike {@link #getStoredCount()}, this number
	 * is calculated every time the function is called and not stored.
	 * It is intended for use in a GUI where a small number of terms
	 * are displayed.  Beware of calling it for every term!!
	 * @return {Number} the number of selected genes
	 */
    getIntersectCount : function(iSet) {
	    if (this.allGenes === null) {
		    return 0;
	    } else {
		    let s = new SortedSet(this.allGenes);
		    //noinspection JSUnresolvedFunction
		    s = s.intersection(iSet.toArray());
		    return s.length;
	    }
    },
	/**
	 * Yields the default sort order, case-insensitive by term name.
	 */
	compare : function(t) {
		return this.name.toLowerCase().localeCompare(t.name.toLowerCase());
	},
	/**
	 * See above
	 * @param t {Term}
	 * @returns {number}
	 */
	compareTo : function(t) {
		return this.name.toLowerCase().localeCompare(t.name.toLowerCase());
	},
    toString : function() {
    	var Dig = 100000;
        Term.Hyp = (Term.Hyp * Dig)/Dig;
        var v = (!Number.isFinite(Term.Hyp) || Number.isNaN(Term.Hyp)) ? Number.toString(Term.Hyp) : Term.Hyp + "";
        return "(" + v + " ; " + this.getStoredCount() + " ) " + this.name;
    },
    getHyp: function(){
        return Term.Hyp;
    },
    getStoredCount : function() {
        return this.storedCount;
    },
    resetStoredCount : function() {
        this.storedCount = -1;
    },
    updateStoredCount : function(aSet) {
      console.log("updating hyp");

        if (this.storedCount == -1) {
	        const it = this.children.iterate();
	        let next = it.next();
	        while (!next.done) {
		        next.value.updateStoredCount(aSet);
		        next = it.next();
	        }
	        let s = new SortedSet(this.allGenes);
	        //noinspection JSUnresolvedFunction
	        s = s.intersection(aSet.toArray());
	        this.storedCount = s.length;
          this.updateHyp(aSet.size());
        }
    },
    initUnion : function() {
        this.allGenes = null;
    },
    findUnion : function(global) {
        if (this.allGenes == null) {
	        this.allGenes = new SortedSet();
	        this.allGenes = this.allGenes.union(this.localGenes);
	        const it = this.children.iterate();
	        let next = it.next();
	        while (!next.done) {
		        const ch = next.value;
		        ch.findUnion(global);
		        this.allGenes = this.allGenes.union(ch.allGenes);
	        }
	        this.allGenes = this.allGenes.intersection(global);
        }
    },
    updateHyp: function(Q){
      Term.Hyp = calcHyp(this.getStoredCount(), Q);
    },
    setTotal: function(t){
      Term.Total = t;
    },
    getTotal: function(){
      return Term.Total;
    },
    calcHyp: function(Q_t, Q){
      var A = this.getTotal();
        var A_t = this.p_t * A;
        Term.H = new HypergeometricDistribution(A, A_t, Q);
        console.log(H.upperCumulativeProbability(Q_t));
        return H.upperCumulativeProbability(Q_t);

    },
	/**
	 * Must be called for every term before {@link #updateSelectedState(SortedSet)}
	 * is called for any term.
	 */
    initSelectedState : function() {
        this.selectedState = Term.STATE_UNKNOWN;
    },
    /**
     * Recursively determines if any of the genes associated with
     * this term or its children intersect with the passed set
     * (usually the current selected set).  Call {@link #initSelectedState()}
     * on all terms before calling this on any term.
     *
     * @param s {SortedSet} of Genes
     */
    updateSelectedState : function(s) {
        if (!this.active) {
            console.log("unselected");
            this.selectedState = Term.STATE_UNSELECTED;
        } else {
	        const it = this.children.iterate();
	        let next = it.next();
	        while (!next.done) {
		        const t = next.value;
		        if (t.selectedState == Term.STATE_UNKNOWN && t.active){
			        t.updateSelectedState(s);
            }
		        if (t.selectedState == Term.STATE_SELECTED){
			        this.selectedState = Term.STATE_SELECTED;
            }
		        next = it.next();
	        }

	        if (this.selectedState = Term.STATE_UNKNOWN) {
		        let x = new SortedSet(this.allGenes);
		        //noinspection JSUnresolvedFunction
		        x = x.intersection(s);
		        this.selectedState = x.length == 0 ? Term.STATE_UNSELECTED : Term.STATE_SELECTED;
	        }
        }
    },
    /**
     * Returns the selected state of this node as determined by
     * {@link #updateSelectedState(SortedSet)}.
     * @return the current selected state
     */
    getSelectedState : function() {
        return this.selectedState;
    }
};

module.exports = Term;
