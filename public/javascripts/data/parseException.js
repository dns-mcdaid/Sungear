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
    this.message = message;
    this.line = line;
    this.t = t;
}

ParseException.prototype.getLine = function() {
    return this.line;
};

module.exports = ParseException;