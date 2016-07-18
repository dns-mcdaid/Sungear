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

require('javascript.util');
var Iterator = javascript.util.Iterator;
var SortedSet = javascript.util.SortedSet;
var TreeSet = javascript.util.TreeSet;

/**
 * Constructs a new GO term.
 * @param id the GO term ID
 * @param name the GO term name
 */
function Term(id, name) {
    this.id = id;           /** @type String GO term ID */
    this.name = name;       /** @type String GO term name */
    this.parents = new TreeSet();       /** This term's parent nodes */
    this.children = new TreeSet();      /** This term's child nodes */
    this.allGenes = new TreeSet();      /** All genes associated with this node and its descendents */
    this.localGenes = new TreeSet();    /** The genes associated strictly with this node */
    this.storedCount = -1;  /** @type int The number of genes in {@link #allGenes} represented in some set, usually the active set */
    this.p_t = 0;           /** @type double z-score calculation term */
    this.stdev = 0.0;       /** @type double z-score calculation term */
    this.zScore = 0.0;      /** @type double z-score calculation term */
    this.active = false;    /** Denotes whether any genes are associated with this term in the current experiment set */
    this.selectedState = this.STATE_UNKNOWN;    /** @type int */
}

// TODO: @Radhika implement with Hypergeo.
Term.prototype = {
    constructor : Term,
    /** Selected state flag: state undetermined */
    STATE_UNKNOWN : 0,
    /** Selected state flag: term selected (term or descendent has intersection with current selected set) */
    STATE_SELECTED : 1,
    /** Selected state flag: term not selected */
    STATE_UNSELECTED : 2
};

module.exports = Term;
