/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalArgumentException = require("./MathIllegalArgumentException");
var LocalizedFormats = require("./util/LocalizedFormats");

function NoBracketingException(specific, lo, hi, fLo, fHi, args){
    if(arguments.length == 4){
        MathIllegalArgumentException.call(this, LocalizedFormats.SAME_SIGN_AT_ENDPOINTS, specific, lo, hi, fLo);
        this.lo = specific;
        this.hi = lo;
        this.fLo = hi;
        this.fHi = fLo;
    }else{
        MathIllegalArgumentException.call(this, specific, lo, hi, fLo, fHi, args);
        this.lo = lo;
        this.hi = hi;
        this.fLo = fLo;
        this.fHi = fHi;
    }
}
NoBracketingException.prototype = Object.create(MathIllegalArgumentException.prototype);
NoBracketingException.prototype.constructor = NoBracketingException;

NoBracketingException.prototype = {
    getLo: function(){
        return this.lo;
    },
    getHi: function(){
        return this.hi;
    },
    getFLo: function(){
        return this.fLo;
    },
    getHi: function(){
        return this.fHi;
    }
};
module.exports = NoBracketingException;