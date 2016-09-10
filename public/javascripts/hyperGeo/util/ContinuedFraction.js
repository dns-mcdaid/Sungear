/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var ConvergenceException = require("../exception/ConvergenceException");
var MaxCountExceededException = require("../exception/MaxCountExceededException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var Precision = require("./Precision");

function ContinuedFraction(){}

ContinuedFraction.DEFAULT_EPSILON = 10e-9;

ContinuedFraction.getA =  function(n,x){};
ContinuedFraction.getB =  function(n,x){};
ContinuedFraction.evaluate =  function(passedX, passedEpsilon, passedIterations){
        var x = passedX;
        var epsilon;
        var maxIterations;
        if(arguments.length == 1){
            epsilon = ContinuedFraction.DEFAULT_EPSILON;
            maxIterations = Number.MAX_VALUE;
        }else if(arguments.length == 2){
            if(passedEpsilon %1 != 0){ //not a whole number
                epsilon = passedEpsilon;
                maxIterations = NUMBER.MAX_VALUE;
            }else{
                epsilon = ContinuedFraction.DEFAULT_EPSILON;
                maxIterations = passedEpsilon;
            }
        }else{
            epsilon = passedEpsilon;
            maxIterations = passedIterations;
        }

        var small = 1e-50;
        var hPrev = ContinuedFraction.getA(0, x);

        // use the value of small as epsilon criteria for zero checks
        if (Precision.equals(hPrev, 0.0, small)) {
            hPrev = small;
        }

        var n = 1;
        var dPrev = 0.0;
        var cPrev = hPrev;
        var hN = hPrev;

        while (n < maxIterations) {
            var a = ContinuedFraction.getA(n, x);
            var b = ContinuedFraction.getB(n, x);

            var dN = a + b * dPrev;
            if (Precision.equals(dN, 0.0, small)) {
                dN = small;
            }
            var cN = a + b / cPrev;
            if (Precision.equals(cN, 0.0, small)) {
                cN = small;
            }

            dN = 1 / dN;
            var deltaN = cN * dN;
            hN = hPrev * deltaN;

            if (!isFinite(hN)) {
                throw new ConvergenceException(LocalizedFormats.CONTINUED_FRACTION_INFINITY_DIVERGENCE,
                    x);
            }
            if (isNaN(hN)) {
                throw new ConvergenceException(LocalizedFormats.CONTINUED_FRACTION_NAN_DIVERGENCE,
                    x);
            }

            if (Math.abs(deltaN - 1.0) < epsilon) {
                break;
            }

            dPrev = dN;
            cPrev = cN;
            hPrev = hN;
            n++;
        }

        if (n >= maxIterations) {
            throw new MaxCountExceededException(LocalizedFormats.NON_CONVERGENT_CONTINUED_FRACTION,
                maxIterations, x);
        }

        return hN;
};
module.exports = ContinuedFraction;