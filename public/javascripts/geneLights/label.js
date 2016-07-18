/**
 * @param name {String}
 * @param cool {boolean}
 * @constructor
 */
function Label(name, cool) {
    this.name = name;
    this.cool = cool;
}

Label.prototype = {
    constructor : Label,
    getName : function() {
        return this.name;
    },
    equals : function(otherName) {
        return this.name == otherName;
    },
    isCool : function() {
        return this.cool;
    },
    toString : function() {
        return this.name;
    },
    compareTo : function(otherLabel) {
        return this.name.localeCompare(otherLabel.name);
    }
};