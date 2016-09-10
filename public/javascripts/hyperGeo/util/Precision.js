/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var MathArithmeticException = require("../exception/MathArithmeticException");
var MathIllegalArgumentException = require("../exception/MathIllegalArgumentException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var FastMath = require("./FastMath");
var big = require('big-decimal');


Precision.EPSILON = (Precision.EXPONENT_OFFSET - 53) << 52;
Precision.SAFE_MIN = (Precision.EXPONENT_OFFSET - 1022) << 52;
Precision.EXPONENT_OFFSET = 1023;
Precision.SGN_MASK = 0x8000000000000000;
Precision.SGN_MASK_FLOAT = 0x80000000;

function Precision(){}
Precision = {
    compareTo : function(x, y, eps){
        if (Precision.equals(x, y, eps)) {
            return 0;
        } else if (x < y) {
            return -1;
        }
        return 1;
    },
    equals : function(x, y, eps){
        if(arguments.length == 2){
            return Precision.equals(x, y, 1);
        }else{
            var xInt = x;
            var yInt = y;
            if(x < 0){
                xInt = Precision.SGN_MASK_FLOAT - xInt;
            }if(y < 0){
                yInt = Precision.SGN_MASK - yInt;
            }
            var isEquals = Math.abs(xInt - yInt) <= 1;

            var finalBool = isEquals && !isNaN(x) && !isNaN(y);
            return finalBool || Math.abs(y - x) <= eps;
        }

    },
    equalsIncludingNaN: function(x, y, eps){
        if(arguments.length == 2){
            return isNaN(x) && isNaN(y) || this.equals(x, y, 1);
        }else{
            return Precision.equalsIncludingNaN(x, y) || (Math.abs(y - x) <= eps);
        }

    },
    equalsWithRelativeTolerance: function(x, y, eps){
        if(Precision.equals(x, y, 1)){
            return true;
        }
        var absoluteMax = Math.max(Math.abs(x), Math.abs(y));
        var relativeDifference = Math.abs((x - y) / absoluteMax);
        return relativeDifference <= eps;

    },
    round: function(x, scale, passedMethod){
        var roundingMethod;
        if(arguments.length == 2){
            roundingMethod = Precision.ROUNDING.ROUND_HALF_UP;
        }else{
            roundingMethod = passedMethod;
        }
        if (!isFinite(x)) {
            return x;
        }
        try{
            var big = new big(Number.toString(x));
            big.setScale(scale, roundingMethod);
            return big;
        } catch(e) {
            return Number.NaN;
        }


    },
    roundUnscaled: function(unscaled, sign, roundingMethod){
        switch (roundingMethod) {
            case Precision.ROUNDING.ROUND_CEILING :
                if (sign == -1) {
                    unscaled = Math.floor(FastMath.nextAfter(unscaled, Number.NEGATIVE_INFINITY));
                } else {
                    unscaled = Math.ceil(FastMath.nextAfter(unscaled, Number.POSITIVE_INFINITY));
                }
                break;
            case Precision.ROUNDING.ROUND_DOWN :
                unscaled = Math.floor(FastMath.nextAfter(unscaled, Number.NEGATIVE_INFINITY));
                break;
            case Precision.ROUNDING.ROUND_FLOOR :
                if (sign == -1) {
                    unscaled = Math.ceil(FastMath.nextAfter(unscaled, Number.POSITIVE_INFINITY));
                } else {
                    unscaled = Math.floor(FastMath.nextAfter(unscaled, Number.NEGATIVE_INFINITY));
                }
                break;
            case Precision.ROUNDING.ROUND_HALF_DOWN : {
                unscaled = FastMath.nextAfter(unscaled, Number.NEGATIVE_INFINITY);
                var fraction = unscaled - Math.floor(unscaled);
                if (fraction > 0.5) {
                    unscaled = Math.ceil(unscaled);
                } else {
                    unscaled = Math.floor(unscaled);
                }
                break;
            }
            case Precision.ROUNDING.ROUND_HALF_EVEN : {
                var fraction = unscaled - Math.floor(unscaled);
                if (fraction > 0.5) {
                    unscaled = Math.ceil(unscaled);
                } else if (fraction < 0.5) {
                    unscaled = Math.floor(unscaled);
                } else {
                    // The following equality test is intentional and needed for rounding purposes
                    if (Math.floor(unscaled) / 2.0 == Math.floor(Math
                                .floor(unscaled) / 2.0)) { // even
                        unscaled = Math.floor(unscaled);
                    } else { // odd
                        unscaled = Math.ceil(unscaled);
                    }
                }
                break;
            }
            case Precision.ROUNDING.ROUND_HALF_UP : {
                unscaled = FastMath.nextAfter(unscaled, Number.POSITIVE_INFINITY);
                var fraction = unscaled - Math.floor(unscaled);
                if (fraction >= 0.5) {
                    unscaled = Math.ceil(unscaled);
                } else {
                    unscaled = Math.floor(unscaled);
                }
                break;
            }
            case Precision.ROUNDING.ROUND_UNNECESSARY :
                if (unscaled != Math.floor(unscaled)) {
                    throw new MathArithmeticException();
                }
                break;
            case Precision.ROUNDING.ROUND_UP :
                unscaled = Math.ceil(FastMath.nextAfter(unscaled,  Number.POSITIVE_INFINITY));
                break;
            default :
                throw new MathIllegalArgumentException(LocalizedFormats.INVALID_ROUNDING_METHOD,
                    roundingMethod,
                    "ROUND_CEILING", Precision.ROUNDING.ROUND_CEILING,
                    "ROUND_DOWN", Precision.ROUNDING.ROUND_DOWN,
                    "ROUND_FLOOR", Precision.ROUNDING.ROUND_FLOOR,
                    "ROUND_HALF_DOWN", Precision.ROUNDING.ROUND_HALF_DOWN,
                    "ROUND_HALF_EVEN", Precision.ROUNDING.ROUND_HALF_EVEN,
                    "ROUND_HALF_UP", Precision.ROUNDING.ROUND_HALF_UP,
                    "ROUND_UNNECESSARY", Precision.ROUNDING.ROUND_UNNECESSARY,
                    "ROUND_UP", Precision.ROUNDING.ROUND_UP);
        }
        return unscaled;
    },
    representableDelta: function(x, originalDelta){
        return x + originalDelta - x;
    },
     ROUNDING : {
        ONE: "ONE",
        ROUND_CEILING: "ROUND_CEILING",
        ROUND_DOWN: "ROUND_DOWN",
        ROUND_FLOOR: "ROUND_FLOOR",
        ROUND_HALF_DOWN: "ROUND_HALF_DOWN",
        ROUND_HALF_EVEN: "ROUND_HALF_EVEN",
        ROUND_HALF_UP: "ROUND_HALF_UP",
        ROUND_UNNECESSARY: "ROUND_UNNECESSARY",
        ROUND_UP: "ROUND_UP",
        TEN: "TEN",
        ZERO: "ZERO"
    }
};




module.exports = Precision;