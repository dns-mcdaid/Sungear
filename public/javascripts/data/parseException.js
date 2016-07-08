/**
 * @author Dennis McDaid
 */

/**
 * @param message of type String
 * @param line of type String
 * @param t of type Throwable
 * @constructor
 */
function ParseException(message, line, t) {
    if (typeof line !== "undefined") {
        this.line = line;
    } else {
        this.line = "";
    }
}

ParseException.prototype.getLine = function() {
    return this.line;
}

module.exports = ParseException;