/*
Radhika Mattoo, February 2016  N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//implements RealDistribution
var RealDistribution = require("./RealDistribution");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var OutOfRangeException = require('../exception/OutOfRangeException');
var UnivariateSolverUtils = require("../analysis/solvers/UnivariateSolverUtils");
var UnivariateFunction = require("../analysis/UnivariateFunction");

  AbstractRealDistribution.prototype = Object.create(RealDistribution.prototype);
  AbstractRealDistribution.prototype.constructor = AbstractRealDistribution;

  var SOLVER_DEFAULT_ABSOLUTE_ACCURACY = 1e-6;
  var solverAbsoluteAccuracy = SOLVER_DEFAULT_ABSOLUTE_ACCURACY;

  function AbstractRealDistribution (rng){

    if(arguments.length !== 0){
      this.random = rng; //random generator
    }
    else this.random = null;
  }
  AbstractRealDistribution.prototype.cumulativeProbability = function(x0, x1){
    return this.probability(x0, x1);

  };

  AbstractRealDistribution.prototype.probability = function (x0, x1){
    if(x0 > x1){
      throw new NumberIsTooLargeException(LocalizedFormats.LOWER_ENDPOINT_ABOVE_UPPER_ENDPOINT,
                                                  // x0, x1, true);
    console.log("AbstractRealDistribution ERROR: arg passed to probability function is too numerically large");
    }
    return this.cumulativeProbability(x1) - this.cumulativeProbability(x0);
  };

  AbstractRealDistribution.prototype.inverseCumulativeProbability = function(p){
    if (p < 0.0 || p > 1.0){
      throw new OutOfRangeException(p,0,1);
    }
    var lowerBound = this.getSupportLowerBound();
    if(p === 0.0) return lowerBound;
    var upperBound = this.getSupportUpperBound();
    if(p === 1.0) return upperBound;


    var mu = this.getNumericalMean();
    var sig = Math.sqrt(this.getNumericalVariance());

    var chebyshevApplies = isFinite(mu) || isFinite(sig) || !(isNan(mu) || isNan(sig));

    if(lowerBound === Number.POSITIVE_INFINITY){
      if(chebyshevApplies){
        upperBound = mu + sig * FastMathSqrt(p/(1-p));
      }else{
        upperBound = 1.0;
        while(this.cumulativeProbability(upperBoung) < p){
          upperBound *= 2.0;
        }
      }
    }

    var toSolve = new UnivariateFunction();
    var x = UnivariateSolverUtils.solve(toSolve, lowerBound, upperBound, this.getSolverAbsoluteAccuracy());

    if(!isSupportConnected()){
      var dc = this.getSolverAbsoluteAccuracy();
      if(x - dx >= this.getSupportLowerBound()){
        var px = this.cumulativeProbability(x);
        if(this.cumulativeProbability(x - dx) == px){
          upperBound = x;
          while(upperBound - lowerBound > dx){
            var midPoint = 0.5 * (lowerBound + upperBound);

            if(this.cumulativeProbability(midPoint) < px){
              lowerBound = midPoint;
            }else{
              upperBound = midPoint;
            }
          }
          return upperBound;
        }
      }
    }
    return x;

  };

  AbstractRealDistribution.prototype.getSolverAbsoluteAccuracy = function(){
    return solverAbsoluteAccuracy;
  };

  //FIXME
  AbstractRealDistribution.prototype.reseedRandomGenerator(seed){
  }

module.exports = AbstractRealDistribution;
