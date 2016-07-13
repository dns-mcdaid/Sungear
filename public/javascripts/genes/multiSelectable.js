/**
 * Interface to be implemented by all components that can participate
 * in a multiple select operation.
 *
 * @author crispy
 */

function MultiSelectable() {
    // TODO: @Dennis find instantiation in SG
}

/** Indicates a union multi-select operation */
MultiSelectable.UNION = 0;
/** Indicates an intersect multi-select operations */
MultiSelectable.INTERSECT = 1;

MultiSelectable.prototype.getMultiSelection = function() {
    // TODO: @Dennis implement better.
    return [];
};

module.exports = MultiSelectable;