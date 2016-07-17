;/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
ChiSquaredDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
ChiSquaredDistribution.prototype.constructor = ChiSquaredDistribution;

var gamma;
var solverAbsoluteAccuracy;
var DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function ChiSquaredDistribution(rng, degreesOfFreedom, inverseCumAccuracy){
  var passedRNG;
  var freedom;
  if(arguments.length == 1){ //(degreesOfFreedom)
    passedRNG = new Well19937c();
    freedom = rng;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 2){ //(degreesOfFreedom, inverseCumAccuracy)
    passedRNG = new Well19937c();
    freedom = rng;
    solverAbsoluteAccuracy = degreesOfFreedom;
  }else{ // 3 args
    passedRNG = rng;
    freedom = degreesOfFreedom;
    solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  gamma = new GammaDistribution(freedom/2, 2);
}


ChiSquaredDistribution.prototype.getDegreesOfFreedom = function() { return gamma.getShape() * 2.0;};

ChiSquaredDistribution.prototype.density = function(x) { return gamma.density(x);};

ChiSquaredDistribution.prototype.cumulativeProbability = function(x)  { return gamma.cumulativeProbability(x);};


//@Override
ChiSquaredDistribution.prototype.getSolverAbsoluteAccuracy = function() { return solverAbsoluteAccuracy;};

ChiSquaredDistribution.prototype.getNumericalMean = function() { return this.getDegreesOfFreedom();};

ChiSquaredDistribution.prototype.getNumericalVariance = function() { return 2 * this.getDegreesOfFreedom();};

ChiSquaredDistribution.prototype.getSupportLowerBound = function() {return 0;};

ChiSquaredDistribution.prototype.getSupportUpperBound = function() {return Double.POSITIVE_INFINITY;};

ChiSquaredDistribution.prototype.isSupportLowerBoundInclusive = function() {return true;};

ChiSquaredDistribution.prototype.isSupportUpperBoundInclusive = function() {return false;};

ChiSquaredDistribution.prototype.isSupportConnected = function() {return true;};
