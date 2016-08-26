"use strict";
module.exports = {
    compare : function(t1, t2) {
        const from = t1.getStoredCount();
        const to = t2.getStoredCount();
        if (from > to) {
            return -1;
        } else if (from < to) {
            return 1;
        } else {
            return t1.getName().toLowerCase().localeCompare(t2.getName().toLowerCase());
        }
    }
};