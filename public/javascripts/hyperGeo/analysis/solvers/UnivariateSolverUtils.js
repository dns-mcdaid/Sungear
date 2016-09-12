/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var NoBracketingException = require("../../exception/NoBracketingException");
var NotStrictlyPositiveException = require("../../exception/NotStrictlyPositiveException");
var NullArgumentException = require("../../exception/NullArgumentException");
var NumberIsTooLargeException = require("../../exception/NumberIsTooLargeException");
var LocalizedFormats = require("../../exception/util/LocalizedFormats");
var AllowedSolution = require("./AllowedSolution");
var BrentSolver = require("./BrentSolver");

function UnivariateSolverUtils(){}

UnivariateSolverUtils = {
    solve: function(func, x0, x1, absoluteAccuracy){
        if(func == null){
            throw new NullArgumentException(LocalizedFormats.FUNCTION);
        }
        var solver;
        if(arguments.length == 3){
            solver = new BrentSolver();
            return solver.solve(Number.MAX_VALUE, func, x0, x1);
        }else{
            solver = new BrentSolver(absoluteAccuracy);
            return solver.solve(Number.MAX_VALUE, func, x0, x1);
        }

    },
    forceSide: function(maxEval, f, bracketing, baseRoot, min, max, allowedSolution){
        if (allowedSolution == AllowedSolution.ANY_SIDE) {
            // no further bracketing required
            return baseRoot;
        }

        // find a very small interval bracketing the root
        var step = Math.max(bracketing.getAbsoluteAccuracy(),
            Math.abs(baseRoot * bracketing.getRelativeAccuracy()));
        var xLo        = Math.max(min, baseRoot - step);
        var fLo        = f.value(xLo);
        var xHi        = Math.min(max, baseRoot + step);
        var fHi        = f.value(xHi);
        var remainingEval = maxEval - 2;
        while (remainingEval > 0) {

            if ((fLo >= 0 && fHi <= 0) || (fLo <= 0 && fHi >= 0)) {
                // compute the root on the selected side
                return bracketing.solve(remainingEval, f, xLo, xHi, baseRoot, allowedSolution);
            }

            // try increasing the interval
            var changeLo = false;
            var changeHi = false;
            if (fLo < fHi) {
                // increasing function
                if (fLo >= 0) {
                    changeLo = true;
                } else {
                    changeHi = true;
                }
            } else if (fLo > fHi) {
                // decreasing function
                if (fLo <= 0) {
                    changeLo = true;
                } else {
                    changeHi = true;
                }
            } else {
                // unknown variation
                changeLo = true;
                changeHi = true;
            }

            // update the lower bound
            if (changeLo) {
                xLo = Math.max(min, xLo - step);
                fLo  = f.value(xLo);
                remainingEval--;
            }

            // update the higher bound
            if (changeHi) {
                xHi = Math.min(max, xHi + step);
                fHi  = f.value(xHi);
                remainingEval--;
            }

        }

        throw new NoBracketingException(LocalizedFormats.FAILED_BRACKETING,
            xLo, xHi, fLo, fHi,
            maxEval - remainingEval, maxEval, baseRoot,
            min, max);
    },
    bracket: function(func, initial, lowerBound, upperBound, passedMax){
        var maxIterations;
        if(arguments.length == 4){
            maxIterations = Number.MAX_VALUE;
        }else{
            maxIterations = passedMax;
        }
        if (func == null) {
            throw new NullArgumentException(LocalizedFormats.FUNCTION);
        }
        if (maxIterations <= 0)  {
            throw new NotStrictlyPositiveException(LocalizedFormats.INVALID_MAX_ITERATIONS, maxIterations);
        }
        UnivariateSolverUtils.verifySequence(lowerBound, initial, upperBound);

        var a = initial;
        var b = initial;
        var fa;
        var fb;
        var numIterations = 0;

        do {
            a = Math.max(a - 1.0, lowerBound);
            b = Math.min(b + 1.0, upperBound);
            fa = func.value(a);

            fb = func.value(b);
            ++numIterations;
        } while ((fa * fb > 0.0) && (numIterations < maxIterations) &&
        ((a > lowerBound) || (b < upperBound)));

        if (fa * fb > 0.0) {
            throw new NoBracketingException(LocalizedFormats.FAILED_BRACKETING,
                a, b, fa, fb,
                numIterations, maxIterations, initial,
                lowerBound, upperBound);
        }

        return [a, b];

    },
    midpoint: function(a, b){
        return (a + b) * 0.5;
    },
    isBracketing: function(func, lower, upper){
        if(func == null){
            throw new NullArgumentException(LocalizedFormats.FUNCTION);
        }
        var fLo = func.value(lower);
        var fHi = func.value(upper);
        return (fLo >= 0 && fHi <= 0) || (fLo <= 0 && fHi >= 0);
    },
    isSequence: function(start, mid, end){
        return (start < mid) && (mid < end);
    },
    verifyInterval: function(lower, upper){
        if(lower >= upper){
            throw new NumberIsTooLargeException(LocalizedFormats.ENDPOINTS_NOT_AN_INTERVAL, lower, upper, false);
        }
    },
    verifySequence: function(lower, initial, upper){
        this.verifyInterval(lower, initial);
        this.verifyInterval(initial, upper);

    },
    verifyBracketing: function(func, lower, upper){
        if (func == null) {
            throw new NullArgumentException(LocalizedFormats.FUNCTION);
        }
        UnivariateSolverUtils.verifyInterval(lower, upper);
        if (!UnivariateSolverUtils.isBracketing(func, lower, upper)) {
            throw new NoBracketingException(lower, upper,
                func.value(lower),
                func.value(upper));
        }
    }
};

module.exports = UnivariateSolverUtils;