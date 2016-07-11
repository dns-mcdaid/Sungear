/**
 * @author crispy
 * @author Rajah_Bimmy
 * Copyright Chris Poultney 2004.
 * Updated by Dennis McDaid.
 */
/** @DONE */

require('javascript.util');
var TreeSet = javascript.util.TreeSet;
var Gene = require('../genes/gene');

/** @param anchor - Anchor[] */
function Vessel(anchor) {
    this.anchor = anchor.sort();    /** @type Anchor[] */
    this.genes = new TreeSet();
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
        this.genes.add(g);
    },
    getFullCount : function() {
        return this.genes.size();
    }
};

module.exports = Vessel;