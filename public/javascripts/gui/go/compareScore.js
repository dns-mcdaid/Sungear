/**
 * Implements a highest-to-lowest comparison of GO terms by z-score.
 * @author RajahBimmy
 */
module.exports = {
    compare : function(t1, t2) {
        var from = t1.getScore();
        var to = t2.getScore();
        if (from > to) {
            return -1;
        } else if (from < to) {
            return 1;
        } else {
            // TODO: Check case
            return t1.getName().localeCompare(t2.getName());
        }
    }
};