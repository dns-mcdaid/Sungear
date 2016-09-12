/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require("./MathIllegalNumberException");
var LocalizedFormats = require("./util/LocalizedFormats");

function NotFiniteNumberException(specific, wrong, args){
    if(arguments.length == 2){
        MathIllegalNumberException.call(this, LocalizedFormats.NOT_FINITE_NUMBER, specific, wrong);
    }else{
        MathIllegalNumberException.call(this, specific, wrong, args);
    }
}

NotFiniteNumberException.prototype = Object.create(MathIllegalNumberException.prototype);
NotFiniteNumberException.prototype.constructor = NotFiniteNumberException;

module.exports = NotFiniteNumberException;