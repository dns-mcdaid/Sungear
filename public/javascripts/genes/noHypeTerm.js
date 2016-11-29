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
 * use on very small sets of terms, such as will fit on one screen in a  list component.
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

/**
 * Constructs a new GO term.
 * @param id the GO term ID
 * @param name the GO term name
 */
function Term(id, name) {
	this.id = id;           /** {String} GO term ID */
	this.name = name;       /** {String} GO term name */
	this.parents = new SortedSet();       /** {SortedSet} This term's parent nodes */
	this.children = new SortedSet();      /** {SortedSet} This term's child nodes */
	this.allGenes = new SortedSet();      /** {SortedSet} All genes associated with this node and its descendents */
	this.localGenes = new SortedSet();    /** {SortedSet} The genes associated strictly with this node */
	this.storedCount = -1;  /** {Number} The number of genes in {@link #allGenes} represented in some set, usually the active set */
	this.p_t = 0;           /** {Number} double z-score calculation term */
	this.stdev = 0.0;       /** {Number} double z-score calculation term */
	this.zScore = 0.0;      /** {Number} double z-score calculation term */
	this.active = false;    /** Denotes whether any genes are associated with this term in the current experiment set */
	this.selectedState = Term.STATE_UNKNOWN;    /** {Number} */
}

/** Selected state flag: state undetermined */
Term.STATE_UNKNOWN = 0;
/** Selected state flag: term selected (term or descendent has intersection with current selected set) */
Term.STATE_SELECTED = 1;
/** Selected state flag: term not selected */
Term.STATE_UNSELECTED = 2;

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
		this.stdev = Math.sqrt(p_t * (1-p_t));
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
	isCollapsed : function(){
		return this.collapsed;
	},
	setCollapsed : function(b){
		this.collapsed = b;
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
		let v = this.zScore;
		return "(" + v.toFixed(2) + ";" + this.getStoredCount() + ") " + this.name;
	},
	/**
	 * Gives this term's z-score.
	 * @return {Number} the current z-score value
	 */
	getScore : function() {
		return this.zScore;
	},
	/**
	 * Returns the stored count of genes at this node
	 * and its descendents as calculated by
	 * {@link #updateStoredCount(SortedSet)}.  Usually the number
	 * of active genes.
	 * @return {Number} the stored gene count
	 */
	getStoredCount : function() {
		return this.storedCount;
	},
	/**
	 * Must be called for every term before {@link #updateStoredCount(SortedSet)}
	 * is called for any term.
	 */
	resetStoredCount : function() {
		this.storedCount = -1;
	},
	/**
	 * Recursively updates the size of the intersection
	 * between the given set (usually the active set)
	 * set and the set of all genes at this node (including
	 * descendents).  Called by {@link gui.GoTerm} when the
	 * active set is updated.
	 * Call {@link #resetStoredCount()} on all nodes before
	 * updating any nodes.
	 * @param aSet {SortedSet} the set to intersect with
	 */
	updateStoredCount : function(aSet) {
		if (this.storedCount == -1) {
			const it = this.children.iterate();
			let next = it.next();
			while (!next.done) {
				next.value.updateStoredCount(aSet);
				next = it.next();
			}
			let s = new SortedSet(this.allGenes);
			//noinspection JSUnresolvedFunction
			s = s.intersection(aSet);
			this.storedCount = s.length;
			this.updateScore(aSet.length);
		}
	},
	/**
	 * Must be called for every term before calling
	 * {@link #findUnion(SortedSet)} on any term
	 * to reset set unions before updating.
	 */
	initUnion : function() {
		this.allGenes = null;
	},
	/**
	 * Recursively finds the union of the genes represented
	 * by this GO term and those represented by all of its descendents,
	 * intersected with the given set (usually the current experiment gene set).
	 * Called when the active set is changed.
	 * Call {@link #initUnion} on all nodes before updating any nodes.
	 * @param global {SortedSet}
	 */
	findUnion : function(global) {
		if (this.allGenes === null) {
			this.allGenes = new SortedSet(this.localGenes);
			const it = this.children.iterate();
			let next = it.next();
			while (!next.done) {
				const ch = next.value;
				ch.findUnion(global);
				this.allGenes = this.allGenes.union(ch.allGenes);
				next = it.next();
			}
			this.allGenes = this.allGenes.intersection(global);
		}
	},
	/**
	 * Updates this term's z-score.
	 * @param total number of represented genes
	 */
	updateScore : function(total) {
		this.zScore = this.calcScore(this.getStoredCount(), total);
		// console.log(this.zScore);
	},
	/**
	 * Calculates the z-score of this term.
	 * @param count {number}  represented genes
	 * @param total {number} total number of genes
	 * @return {number} the z-score
	 */
	calcScore : function(count, total) {
		const f_t = count / total;
		// console.log("PT: " + this.p_t);
		// console.log("STD DEV: " + this.stdev);
		// 100% of genes selected for term w/ 100% of genes associated ==> z-score = 0
		return (f_t-this.p_t && this.stdev == 0) ? 0 : (f_t - this.p_t) * Math.sqrt(total) / this.stdev;
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
	 * @param s the set to intersect with
	 */
	updateSelectedState : function(s) {
		if (!this.active) {
			this.selectedState = Term.STATE_UNSELECTED;
		} else {
			const it = this.children.iterate();
			let next = it.next();
			while (!next.done) {
				const t = next.value;
				if (t.selectedState == Term.STATE_UNKNOWN && t.active)
					t.updateSelectedState(s);
				if (t.selectedState == Term.STATE_SELECTED)
					this.selectedState = Term.STATE_SELECTED;
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
