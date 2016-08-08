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
    this.stdev = 0.0;       /** @type double z-score calculation term */
    this.zScore = 0.0;      /** @type double z-score calculation term */
    this.active = false;    /** Denotes whether any genes are associated with this term in the current experiment set */
    this.selectedState = Term.STATE_UNKNOWN;    /** @type int */
}

/** Selected state flag: state undetermined */
Term.STATE_UNKNOWN = 0;
/** Selected state flag: term selected (term or descendent has intersection with current selected set) */
Term.STATE_SELECTED = 1;
/** Selected state flag: term not selected */
Term.STATE_UNSELECTED = 2;

// TODO: @Radhika implement with Hypergeo.
Term.prototype = {
    constructor : Term,
    cleanup : function() {
        for (var it = this.children.iterator(); it.hasNext(); ) {
            it.next().cleanup();
        }
        this.children = new TreeSet();
        this.parents = new TreeSet();
        this.allGenes = new TreeSet();
        this.localGenes = new TreeSet();
    },
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
        return this.parents.size() == 0;
    },
    setActive : function() {
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
    getIntersectCount : function(iSet) {
        if (this.allGenes === null) {
            return 0;
        } else {
            var s = new SortedSet();
            var setArray = iSet.toArray();
            for (var i = 0; i < setArray.length; i++) {
                if (this.allGenes.contains(setArray[i])) {
                    s.push(setArray[i]);
                }
            }
            return s.size();
        }
    },
    compare : function(t) {
        return this.name.localeCompare(t.name);
    },
    compareTo : function(t) {
        return this.name.localeCompare(t.name);
    },
    toString : function() {
        var v = this.zScore;
        return "(" + v + ";" + this.getStoredCount() + ")" + this.name;
    },
    getScore : function() {
        return this.zScore;
    },
    getStoredCount : function() {
        return this.storedCount;
    },
    resetStoredCount : function() {
        this.storedCount = -1;
    },
    updateStoredCount : function(aSet) {
        if (this.storedCount == -1) {
            var it = this.children.iterator();
            while (it.hasNext()) {
                it.next().updateStoredCount(aSet);
            }
            var s = new SortedSet();
            var aSetArr = aSet.toArray();
            for (var i = 0; i < aSetArr.length; i++) {
                if (this.allGenes.contains(aSetArr[i])) {
                    s.push(aSetArr[i]);
                }
            }
            this.storedCount = s.size();
            this.updateScore(aSet.size());
        }
    },
    initUnion : function() {
        this.allGenes = null;
    },
    findUnion : function(global) {
        if (this.allGenes == null) {
            this.allGenes = new SortedSet();
            var locArray = this.localGenes.toArray();
            for (var i = 0; i < locArray.length; i++) {
                this.allGenes.push(locArray[i]);
            }
            var it = this.children.iterator();
            while (it.hasNext()) {
                var ch = it.next();
                ch.findUnion(global);
                var chAll = ch.allGenes.toArray();
                for (var j = 0; j < chAll.length; j++) {
                    this.allGenes.push(chAll[j]);
                }
            }
            var allArray = this.allGenes.toArray();
            var s = new TreeSet();
            for (var k = 0; k < allArray.length; k++) {
                if (global.contains(allArray[k])) {
                    s.push(allArray[k])
                }
            }
            this.allGenes = s;
        }
    },
    updateScore : function(total) {
        this.zScore = this.calcScore(this.getStoredCount(), total);
    },
    calcScore : function(count, total) {
        var f_t = count / total;
        return (f_t-this.p_t && this.stdev == 0) ? 0 : (f_t - this.p_t) * Math.sqrt(total) / this.stdev;
    },
    initSelectedState : function() {
        this.selectedState = Term.STATE_UNKNOWN;
    },
    updateSelectedState : function(s) {
        if (!this.active) {
            this.selectedState = Term.STATE_UNSELECTED;
        } else {
            for (var it = this.children.iterator(); it.hasNext(); ) {
                var t = it.next();
                if (t.selectedState == Term.STATE_UNKNOWN && t.active) {
                    t.updateSelectedState(s);
                }
                if (t.selectedState == Term.STATE_SELECTED) {
                    this.selectedState = Term.STATE_SELECTED;
                }
            }
            if (this.selectedState = Term.STATE_UNKNOWN) {
                var x = new SortedSet();
                var allArr = this.allGenes.toArray();
                for (var i = 0; i < allArr.length; i++) {
                    if (s.contains(allArr[i])) {
                        x.push(allArr[i]);
                    }
                }
                this.selectedState = x.size() == 0 ? Term.STATE_UNSELECTED : Term.STATE_SELECTED;
            }
        }
    },
    getSelectedState : function() {
        return this.selectedState;
    },
    addChildren : function(c) {
        this.children.addEach(c);
    },
    addParents : function(p) {
        this.parents.addEach(p);
    },
    addGenes : function(g) {
        this.localGenes.addEach(g);
    }
};

module.exports = Term;
