"use strict";
/**
 * Implements a highest-to-lowest comparison of GO terms by z-score.
 * @author RajahBimmy
 */
module.exports = function(t1, t2) {
    const from = t1.getScore();
    const to = t2.getScore();
    if (from > to) {
        return -1;
    } else if (from < to) {
        return 1;
    } else {
        return t1.getName().toLowerCase().localeCompare(t2.getName().toLowerCase());
    }
};
