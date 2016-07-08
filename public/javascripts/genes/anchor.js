/**
 * @author crispy & Rajah_Bimmy
 * Copyright Chris Poultney 2004.
 */

/** @param name - String */
function Anchor(name) {
    this.name = name;   /** @type String */
}

Anchor.prototype = {
    constructor : Anchor,

    cleanup : function() {
        console.log("Cleaning up Anchor");
        return;
    },

    compare : function(a) {
        var str1 = this.name.toLowerCase();
        var str2 = a.name.toLowerCase();
        return str1.localeCompare(str2);
    }
};

module.exports = Anchor;