/**
 * Implements a highest-to-lowest comparison of GO terms by z-score.
 * @author RajahBimmy
 */
module.exports = {
    compare : function(t1, t2) {
        // TODO: Lower case?
        return t2.getName().localeCompare(t2.getName());
    }
};