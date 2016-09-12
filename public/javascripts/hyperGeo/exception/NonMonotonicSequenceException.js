/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var LocalizedFormats = require("./util/LocalizedFormats");
var MathIllegalNumberException = require("./MathIllegalNumberException");
var MathArrays = require("../util/MathArrays.js");

function NonMonotonicSequenceException(wrong, previous, index, direction, strict){
    if(arguments.length == 3){
        MathIllegalNumberException.call(this, LocalizedFormats.NOT_STRICTLY_INCREASING_SEQUENCE, wrong, previous, index, index -1);
        this.direction = MathArrays.OrderDirection.INCREASING;
        this.strict = true;
        this.index = index;
        this.previous = previous;
    }else{
        MathIllegalNumberException.call(direction == MathArrays.OrderDirection.INCREASING ?
                (strict ?
                    LocalizedFormats.NOT_STRICTLY_INCREASING_SEQUENCE :
                    LocalizedFormats.NOT_INCREASING_SEQUENCE) :
                (strict ?
                    LocalizedFormats.NOT_STRICTLY_DECREASING_SEQUENCE :
                    LocalizedFormats.NOT_DECREASING_SEQUENCE),
            wrong, previous, index, index - 1);
        this.direction = direction;
        this.strict = strict;
        this.index = index;
        this.previous = previous;
    }

}

NonMonotonicSequenceException.prototype = Object.create(MathIllegalNumberException.prototype);
NonMonotonicSequenceException.prototype.constructor = NonMonotonicSequenceException;


NonMonotonicSequenceException.prototype ={
    getDirection: function(){
        return this.direction;
    },
    getStrict: function(){
        return this.strict;
    },
    getIndex: function(){
        return this.index;
    },
    getPrevious: function(){
        return this.previous;
    }
};

module.exports = NonMonotonicSequenceException;
