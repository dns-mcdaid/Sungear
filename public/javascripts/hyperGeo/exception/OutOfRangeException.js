/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require("./MathIllegalNumberException");
var LocalizedFormats = require("./util/LocalizedFormats");

function OutOfRangeException(specific, wrong, lo, hi){
    if(arguments.length == 3){
        MathIllegalNumberException.call(this, LocalizedFormats.OUT_OF_RANGE_SIMPLE, specific, wrong, lo);
        this.lo = wrong;
        this.hi = lo;
    }else{
        MathIllegalNumberException.call(this, specific, wrong, lo, hi);
        this.lo = lo;
        this.hi = hi;
    }
}

OutOfRangeException.prototype = Object.create(MathIllegalNumberException.prototype);
OutOfRangeException.prototype.constructor = OutOfRangeException;


OutOfRangeException.prototype = {
  getLo: function(){
      return this.lo;
  },
    getHi: function(){
      return this.hi;
    }
};
module.exports = OutOfRangeException;