"use strict";
/**
 * Implements a highest-to-lowest comparison of GO terms by z-score.
 * @author RajahBimmy
 */
module.exports = function(t1, t2) {
    return t1.getName().toLowerCase().localeCompare(t2.getName().toLowerCase());
};