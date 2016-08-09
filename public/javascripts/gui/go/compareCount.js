module.exports = {
    compare : function(t1, t2) {
        var from = t1.getStoredCount();
        var to = t2.getStoredCount();
        if (from > to) {
            return -1;
        } else if (from < to) {
            return 1;
        } else {
            // TODO: Check if I have to put toLowerCase here.
            return t1.getName().localeCompare(t2.getName());
        }
    }
};