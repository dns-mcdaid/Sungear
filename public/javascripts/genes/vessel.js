"use strict";
/**
 * @author crispy
 * @author Rajah_Bimmy
 */

const SortedSet = require('collections/sorted-set');

/** @param anchor {Array} of Anchors */
function Vessel(anchor) {
    this.anchor = anchor.sort();    /** {Anchor[]} */
    this.genes = new SortedSet();
}

Vessel.prototype = {
    constructor : Vessel,
    toString : function(){
        var s = "";
        for(var i = 0; i < this.anchor.length; i++) {
            s += (i > 0 ? " | " : "") + this.anchor[i].name;
        }
        return s;
    },
    cleanup : function() {
        this.genes = null;
        this.anchor = null;
    },
    /** @param g - Gene */
    addGene : function(g) {
        this.genes.push(g);
    },
    getFullCount : function() {
        return this.genes.length;
    }
};

module.exports = Vessel;