/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require("./MathIllegalNumberException");
var LocalizedFormats = require("./util/LocalizedFormats");

function NotANumberException(){
    MathIllegalNumberException.call(this,LocalizedFormats.NAN_NOT_ALLOWED, Number.NaN);
}

NotANumberException.prototype = Object.create(MathIllegalNumberException.prototype);
NotANumberException.prototype.constructor = NotANumberException;

module.exports = NotANumberException;