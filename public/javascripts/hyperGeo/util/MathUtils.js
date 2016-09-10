/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathArithmeticException = require("../exception/MathArithmeticException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var NotFiniteNumberException = require("../exception/NotFiniteNumberException");
var NullArgumentException = require("../exception/NullArgumentException");

function MathUtils(){}
MathUtils.TWO_PI = 2 * Math.PI;
MathUtils = {
  normalizeAngle: function(a, center){
      return a - MathUtils.TWO_PI * Math.floor((a + Math.PI - center)/ MathUtils.TWO_PI);
  },
    reduce: function(a, period, offset){
      var p = Math.abs(period);
        return a - p * Math.floor((a - offset) / p) - offset;
    },
    checkNotNull: function(o){
        if (o === null) {
            throw new NullArgumentException();
        }
    },
    checkFinite(val){
        if(x instanceof Number){
            if(!isFinite(val) || isNaN(val)){
                throw new NotFiniteNumberException(x);
            }
        }else{ //array
            for(var i = 0; i < val.length; i ++){
                var x = val[i];
                if(!isFinite(x) || isNaN(x)){
                    throw new NotFiniteNumberException(LocalizedFormats.ARRAY_ELEMENT, x, i);
                }
            }
        }
    },
    copySign(magnitude, sign){
        if ((magnitude >= 0 && sign >= 0) ||
            (magnitude < 0 && sign < 0)) { // Sign is OK.
            return magnitude;
        } else if (sign >= 0 &&
            magnitude == Number.MIN_VALUE) {
            throw new MathArithmeticException(LocalizedFormats.OVERFLOW);
        } else {
            return -magnitude; // Flip sign.
        }
    }
};
module.exports = MathUtils;
