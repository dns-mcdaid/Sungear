/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalStateException = require("./MathIllegalStateException");
var REPORT_URL = "https://issues.apache.org/jira/browse/MATH";
var LocalizedFormats = require("./util/LocalizedFormats");

function MathInternalError(pattern, args){
    if(arguments.length == 0){
        this.getContext().addMessage(LocalizedFormats.INTERNAL_ERROR, REPORT_URL);
    }else if(arguments.length == 1){
        MathIllegalStateException.call(this, pattern, LocalizedFormats.INTERNAL_ERROR, REPORT_URL)
    }else{
        MathIllegalStateException.call(this, pattern, args);
    }

}

MathInternalError.prototype = Object.create(MathIllegalStateException.prototype);
MathInternalError.prototype.constructor = MathInternalError;

module.exports = MathInternalError;