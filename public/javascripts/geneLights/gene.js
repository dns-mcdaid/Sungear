/**
 * @author Dennis McDaid
 */

function Gene(name, value) {
    this.name = name;   /** @type String */
    this.value = value; /** @type float */
}

Gene.prototype = {
    constructor : Gene,
    getName : function() {
        return this.name;
    },
    getValue : function() {
        return this.value;
    },
    /**
     * compare two genes ascendingly according to their expression values
     */
    compareTo : function(otherGene) {
        if ( this.value < otherGene.value ) {
            return -1;
        } else if ( this.value > otherGene.value) {
            return 1;
        } else {
            return 0;
        }
    },
    equals : function(other) {
        if ( this.name == other.name ){
            return true;
        } else {
            return false;
        }
    }
};

module.exports = Gene;