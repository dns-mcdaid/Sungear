/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalArgumentException = require("./MathIllegalArgumentException");
var LocalizedFormats = require("./util/LocalizedFormats");

function NullArgumentException(pattern, args){
    if(arguments.length == 0){
        MathIllegalArgumentException.call(this, LocalizedFormats.NULL_NOT_ALLOWED);
    }else{
        MathIllegalArgumentException.call(this, pattern, args);
    }
}

NullArgumentException.prototype = Object.create(MathIllegalArgumentException.prototype);
NullArgumentException.prototype.constructor = NullArgumentException;




module.exports = NullArgumentException;