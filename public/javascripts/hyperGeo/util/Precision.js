/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var MathArithmeticException = require("../exception/MathArithmeticException");
var MathIllegalArgumentException = require("../exception/MathIllegalArgumentException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");


var EPSILON = (EXPONENT_OFFSET - 53) << 52;
var SAFE_MIN = (EXPONENT_OFFSET - 1022) << 52;
var EXPONENT_OFFSET = 1023;
var SGN_MASK = 0x8000000000000000;
var SGN_MASK_FLOAT = 0x80000000;

function Precision(){}
Precision.compareTo = function(x, y, eps){
    if (Precision.equals(x, y, eps)) {
        return 0;
    } else if (x < y) {
        return -1;
    }
    return 1;
};
Precision.equals = function(passedX, passedY, passedEps){
    var x;
    var y;
    var eps;
    if(arguments.length == 2){

    }else{
        if(passedEps %1 !== 0){ //double/fraction

        }
    }

};
module.exports = Precision;