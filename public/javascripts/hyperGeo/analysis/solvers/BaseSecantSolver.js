/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var UnivariateFunction = require("../UnivariateFunction");
var MathInternalError = require("../../exception/MathInternalError");
var ConvergenceException = require("../../exception/ConvergenceException");
var AbstractUnivariateSolver = require("./AbstractUnivariateSolver");
var AllowedSolution = require("./AllowedSolution");

BaseSecantSolver.DEFAULT_ABSOLUTE_ACCURACY = 1e-6;

function BaseSecantSolver(passedRelative, passedAbsolute, passedFunction, passedMethod){
    if(arguments.length == 2){
        AbstractUnivariateSolver.call(this, passedRelative);
        this.allowed = AllowedSolution.ANY_SIDE;
        this.method = passedAbsolute;
    }else if(arguments.length == 3){
        AbstractUnivariateSolver.call(this, passedRelative, passedAbsolute);
        this.allowed = AllowedSolution.ANY_SIDE;
        this.method = passedFunction;
    }else{
        AbstractUnivariateSolver.call(this, passedRelative, passedAbsolute, passedFunction);
        this.allowed = AllowedSolution.ANY_SIDE;
        this.method = passedMethod;
    }
}

BaseSecantSolver.DEFAULT_ABSOLUTE_ACCURACY = 1e-6;

BaseSecantSolver.prototype = Object.create(AbstractUnivariateSolver.prototype);
BaseSecantSolver.prototype.constructor = BaseSecantSolver;

BaseSecantSolver.prototype = {
  constructor: BaseSecantSolver,
    solve: function(passedEval, passedF, passedMin, passedMax, passedStart, passedAllowed){
      if(arguments.length == 5){
          if(typeof passedStart == "number") {
              return AbstractUnivariateSolver.prototype.solve(this, passedEval, passedF, passedMin, passedMax, passedStart,AllowedSolution.ANY_SIDE);
          }else{
              AbstractUnivariateSolver.prototype.solve(this, passedEval, passedF, passedMin, passedMax, passedMin + 0.5 * (passedMax - passedMin), passedStart);
          }
      }else{
          this.allowed = passedAllowed;
          return  AbstractUnivariateSolver.prototype.solve(this, passedEval, passedF, passedMin, passedMax, passedStart);
      }
    },
    doSolve: function(){
        // Get initial solution
        var x0 = this.getMin();
        var x1 = this.getMax();
        var f0 = this.computeObjectiveValue(x0);
        var f1 = this.computeObjectiveValue(x1);

        // If one of the bounds is the exact root, return it. Since these are
        // not under-approximations or over-approximations, we can return them
        // regardless of the allowed solutions.
        if (f0 == 0.0) {
            return x0;
        }
        if (f1 == 0.0) {
            return x1;
        }

        // Verify bracketing of initial solution.
        this.verifyBracketing(x0, x1);

        // Get accuracies.
        var ftol = this.getFunctionValueAccuracy();
        var atol = this.getAbsoluteAccuracy();
        var rtol = this.getRelativeAccuracy();

        // Keep track of inverted intervals, meaning that the left bound is
        // larger than the right bound.
        var inverted = false;

        // Keep finding better approximations.
        while (true) {
            // Calculate the next approximation.
            var x = x1 - ((f1 * (x1 - x0)) / (f1 - f0));
            var fx = this.computeObjectiveValue(x);

            // If the new approximation is the exact root, return it. Since
            // this is not an under-approximation or an over-approximation,
            // we can return it regardless of the allowed solutions.
            if (fx == 0.0) {
                return x;
            }

            // Update the bounds with the new approximation.
            if (f1 * fx < 0) {
                // The value of x1 has switched to the other bound, thus inverting
                // the interval.
                x0 = x1;
                f0 = f1;
                inverted = !inverted;
            } else {
                switch (this.method) {
                    case this.Method.ILLINOIS:
                        f0 *= 0.5;
                        break;
                    case this.Method.PEGASUS:
                        f0 *= f1 / (f1 + fx);
                        break;
                    case this.Method.REGULA_FALSI:
                        // Detect early that algorithm is stuck, instead of waiting
                        // for the maximum number of iterations to be exceeded.
                        if (x == x1) {
                            throw new ConvergenceException();
                        }
                        break;
                    default:
                        // Should never happen.
                        throw new MathInternalError();
                }
            }
            // Update from [x0, x1] to [x0, x].
            x1 = x;
            f1 = fx;

            // If the function value of the last approximation is too small,
            // given the function value accuracy, then we can't get closer to
            // the root than we already are.
            if (Math.abs(f1) <= ftol) {
                switch (this.allowed) {
                    case AllowedSolution.ANY_SIDE:
                        return x1;
                    case AllowedSolution.LEFT_SIDE:
                        if (inverted) {
                            return x1;
                        }
                        break;
                    case AllowedSolution.RIGHT_SIDE:
                        if (!inverted) {
                            return x1;
                        }
                        break;
                    case AllowedSolution.BELOW_SIDE:
                        if (f1 <= 0) {
                            return x1;
                        }
                        break;
                    case AllowedSolution.ABOVE_SIDE:
                        if (f1 >= 0) {
                            return x1;
                        }
                        break;
                    default:
                        throw new MathInternalError();
                }
            }

            // If the current interval is within the given accuracies, we
            // are satisfied with the current approximation.
            if (Math.abs(x1 - x0) < Math.max(rtol * Math.abs(x1),
                    atol)) {
                switch (this.allowed) {
                    case AllowedSolution.ANY_SIDE:
                        return x1;
                    case AllowedSolution.LEFT_SIDE:
                        return inverted ? x1 : x0;
                    case AllowedSolution.RIGHT_SIDE:
                        return inverted ? x0 : x1;
                    case AllowedSolution.BELOW_SIDE:
                        return (f1 <= 0) ? x1 : x0;
                    case AllowedSolution.ABOVE_SIDE:
                        return (f1 >= 0) ? x1 : x0;
                    default:
                        throw new MathInternalError();
                }
            }
        }
    },
    Method : {
      REGULA_FALSI : "REGULA_FALSI",
        ILLINOIS : "ILLINOIS",
        PEGASUS: "PEGASUS"
    }
};

module.exports = BaseSecantSolver;