;/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractRealDistribution = require("./AbstractRealDistribution");
var GammaDistribution = require("./GammaDistribution");
var seedrandom = require("seedrandom");

ChiSquaredDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
ChiSquaredDistribution.prototype.constructor = ChiSquaredDistribution;

ChiSquaredDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function ChiSquaredDistribution(rng, degreesOfFreedom, inverseCumAccuracy){
  var passedRNG;
  var freedom;
  if(arguments.length == 1){ //(degreesOfFreedom)
    passedRNG = seedrandom();
    freedom = rng;
    this.solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 2){ //(degreesOfFreedom, inverseCumAccuracy)
    passedRNG = seedrandom();
    freedom = rng;
    this.solverAbsoluteAccuracy = degreesOfFreedom;
  }else{ // 3 args
    passedRNG = rng;
    freedom = degreesOfFreedom;
    this.solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  this.gamma = new GammaDistribution(freedom/2, 2);
}


ChiSquaredDistribution.prototype.getDegreesOfFreedom = function() { return this.gamma.getShape() * 2.0;};

ChiSquaredDistribution.prototype.density = function(x) { return this.gamma.density(x);};

ChiSquaredDistribution.prototype.cumulativeProbability = function(x)  { return this.gamma.cumulativeProbability(x);};


//@Override
ChiSquaredDistribution.prototype.getSolverAbsoluteAccuracy = function() { return this.solverAbsoluteAccuracy;};

ChiSquaredDistribution.prototype.getNumericalMean = function() { return this.getDegreesOfFreedom();};

ChiSquaredDistribution.prototype.getNumericalVariance = function() { return 2 * this.getDegreesOfFreedom();};

ChiSquaredDistribution.prototype.getSupportLowerBound = function() {return 0;};

ChiSquaredDistribution.prototype.getSupportUpperBound = function() {return Number.POSITIVE_INFINITY;};

ChiSquaredDistribution.prototype.isSupportLowerBoundInclusive = function() {return true;};

ChiSquaredDistribution.prototype.isSupportUpperBoundInclusive = function() {return false;};

ChiSquaredDistribution.prototype.isSupportConnected = function() {return true;};

module.exports = ChiSquaredDistribution;