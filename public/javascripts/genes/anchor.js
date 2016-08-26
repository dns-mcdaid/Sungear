"use strict";
/**
 * @author crispy & Rajah_Bimmy
 * Copyright Chris Poultney 2004.
 */

/** @param name {String} */
function Anchor(name) {
    this.name = name;   /** {String} */
}

Anchor.prototype = {
    constructor : Anchor,

    cleanup : function() {
        console.log("Cleaning up Anchor");
    },

    compare : function(a) {
        let str1 = this.name.toLowerCase();
        let str2 = a.name.toLowerCase();
        return str1.localeCompare(str2);
    },

    compareTo : function(a) {
        let str1 = this.name.toLowerCase();
        let str2 = a.name.toLowerCase();
        return str1.localeCompare(str2);
    }
};

module.exports = Anchor;