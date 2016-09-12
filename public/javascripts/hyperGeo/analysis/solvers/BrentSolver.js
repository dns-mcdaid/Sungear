/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var AbstractUnivariateSolver = require("./AbstractUnivariateSolver");
var NoBracketingException = require("../../exception/NoBracketingException");
var Precision = require("../../util/Precision");

BrentSolver.DEFAULT_ABSOLUTE_ACCURACY = 1e-6;
function BrentSolver(passedRelative, passedAbsolute, passedFunction){
    if(arguments.length == 0){
        AbstractUnivariateSolver.call(this, BrentSolver.DEFAULT_ABSOLUTE_ACCURACY);
    }else if(arguments.length == 1){
        AbstractUnivariateSolver.call(this, passedRelative);
    }else if(arguments.length == 2){
        AbstractUnivariateSolver.call(this, passedRelative, passedAbsolute);
    }else{
        AbstractUnivariateSolver.call(this, passedRelative, passedAbsolute, passedFunction);
    }
}

BrentSolver.prototype = Object.create(AbstractUnivariateSolver.prototype);
BrentSolver.prototype.constructor = BrentSolver;

BrentSolver.prototype = {
    doSolve: function(){
        var min = this.getMin();
        var max = this.getMax();
        var initial = this.getStartValue();
        var functionValueAccuracy = this.getFunctionValueAccuracy();

        this.verifySequence(min, initial, max);

        // Return the initial guess if it is good enough.
        var yInitial = this.computeObjectiveValue(initial);
        if (Math.abs(yInitial) <= functionValueAccuracy) {
            return initial;
        }

        // Return the first endpoint if it is good enough.
        var yMin = this.computeObjectiveValue(min);
        if (Math.abs(yMin) <= functionValueAccuracy) {
            return min;
        }

        // Reduce interval if min and initial bracket the root.
        if (yInitial * yMin < 0) {
            return this.brent(min, initial, yMin, yInitial);
        }

        // Return the second endpoint if it is good enough.
        var yMax = this.computeObjectiveValue(max);
        if (Math.abs(yMax) <= functionValueAccuracy) {
            return max;
        }

        // Reduce interval if initial and max bracket the root.
        if (yInitial * yMax < 0) {
            return this.brent(initial, max, yInitial, yMax);
        }

        throw new NoBracketingException(min, max, yMin, yMax);

    },
    brent: function(lo, hi, fLo, fHi){
        var a = lo;
        var fa = fLo;
        var b = hi;
        var fb = fHi;
        var c = a;
        var fc = fa;
        var d = b - a;
        var e = d;

        var t = this.getAbsoluteAccuracy();
        var eps = this.getRelativeAccuracy();

        while (true) {
            if (Math.abs(fc) < Math.abs(fb)) {
                a = b;
                b = c;
                c = a;
                fa = fb;
                fb = fc;
                fc = fa;
            }

            var tol = 2 * eps * Math.abs(b) + t;
            var m = 0.5 * (c - b);

            if (Math.abs(m) <= tol ||
                Precision.equals(fb, 0))  {
                return b;
            }
            if (Math.abs(e) < tol ||
                Math.abs(fa) <= Math.abs(fb)) {
                // Force bisection.
                d = m;
                e = d;
            } else {
                var s = fb / fa;
                var p;
                var q;
                // The equality test (a == c) is intentional,
                // it is part of the original Brent's method and
                // it should NOT be replaced by proximity test.
                if (a == c) {
                    // Linear interpolation.
                    p = 2 * m * s;
                    q = 1 - s;
                } else {
                    // Inverse quadratic interpolation.
                    q = fa / fc;
                    var r = fb / fc;
                    p = s * (2 * m * q * (q - r) - (b - a) * (r - 1));
                    q = (q - 1) * (r - 1) * (s - 1);
                }
                if (p > 0) {
                    q = -q;
                } else {
                    p = -p;
                }
                s = e;
                e = d;
                if (p >= 1.5 * m * q - Math.abs(tol * q) ||
                    p >= Math.abs(0.5 * s * q)) {
                    // Inverse quadratic interpolation gives a value
                    // in the wrong direction, or progress is slow.
                    // Fall back to bisection.
                    d = m;
                    e = d;
                } else {
                    d = p / q;
                }
            }
            a = b;
            fa = fb;

            if (Math.abs(d) > tol) {
                b += d;
            } else if (m > 0) {
                b += tol;
            } else {
                b -= tol;
            }
            fb = this.computeObjectiveValue(b);
            if ((fb > 0 && fc > 0) ||
                (fb <= 0 && fc <= 0)) {
                c = a;
                fc = fa;
                d = b - a;
                e = d;
            }
        }

    }
};

module.exports = BrentSolver;