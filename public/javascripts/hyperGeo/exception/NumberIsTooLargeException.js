/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require('./MathIllegalNumberException');
var LocalizedFormats = require("./util/LocalizedFormats");

NumberIsTooLargeException.protoype = Object.create(MathIllegalNumberException.prototype);
NumberIsTooLargeException.protoype.constructor = NumberIsTooLargeException;

function NumberIsTooLargeException(specific, wrong, max, boundIsAllowed){
    if(arguments.length == 3){
        var specific1 = boundIsAllowed ?
            LocalizedFormats.NUMBER_TOO_LARGE :
            LocalizedFormats.NUMBER_TOO_LARGE_BOUND_EXCLUDED;
        MathIllegalNumberException.call(this, specific1, specific, wrong);
        this.max = wrong;
        this.boundIsAllowed = max;
    }else{
        MathIllegalNumberException.call(this, specific, wrong, max);
        this.max = max;
        this.boundIsAllowed = boundIsAllowed;
    }
}

NumberIsTooLargeException.protoype = {
    getBoundIsAllowed: function(){
        return this.boundIsAllowed;
    },
    getMax: function(){
        return this.max;
    }
};

module.exports = NumberIsTooLargeException;