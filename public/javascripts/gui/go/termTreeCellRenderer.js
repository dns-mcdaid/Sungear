"use strict";
/**
 * @author RajahBimmy
 */

/**
 *
 * @param genes {GeneList}
 * @constructor
 */
function TermTreeCellRenderer(genes) {
    this.genes = genes;
}

TermTreeCellRenderer.prototype = {
    constructor : TermTreeCellRenderer,
    /**
     * @param tree {JTree}?
     * @param value {Object}
     * @param selected {boolean}
     * @param expanded {boolean}
     * @param leaf {boolean}
     * @param row {number}
     * @param hasFocus {boolean}
     */
    getTreeCellRendererComponent(tree, value, selected, expanded, leaf, row, hasFocus) {
    }
};

module.exports = TermTreeCellRenderer;