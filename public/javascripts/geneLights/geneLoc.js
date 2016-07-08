/**
 * @author Dennis McDaid
 */

function GeneLoc(listID, offset) {
    this.listID = listID;   /** @type int */
    this.offset = offset;   /** @type int */
}


GeneLoc.prototype = {
    constructor : GeneLoc,
    /** get gene location's anchor id */
    getListID : function() {
        return this.listID;
    },
    /** get the gene location's offset in an anchor */
    getOffset : function() {
        return this.offset;
    }
};

module.exports = GeneLoc;