/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require("./MathIllegalNumberException");
var LocalizedFormats = require("./util/LocalizedFormats");

function DimensionMismatchException(passedSpecific, wrong, expected){
    var specific;
    if(arguments.length == 2){
        specific = LocalizedFormats.DIMENSIONS_MISMATCH_SIMPLE;
        this.dimension = wrong;
        MathIllegalNumberException.call(this, specific, passedSpecific, wrong);
    }else{
        specific = passedSpecific;
        this.dimension = expected;
        MathIllegalNumberException.call(this, specific, wrong, expected);
    }
}
DimensionMismatchException.prototype = Object.create(MathIllegalNumberException.prototype);
DimensionMismatchException.prototype.constructor = DimensionMismatchException;

DimensionMismatchException.prototype = {
    getDimension: function(){
        return this.dimension;
    }
};

module.exports = DimensionMismatchException;