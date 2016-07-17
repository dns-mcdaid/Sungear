/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var Gamma = require("../special/Gamma");
var Beta = require("../special/Beta");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var AbstractRealDistribution = require("./AbstractRealDistribution");

TDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
TDistribution.prototype.constructor = TDistribution;


var DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
var solverAbsoluteAccuracy;

function TDistribution(rng, degreeOfFreedom, inverseCumAccuracy){
  var passedRNG;
  var passedDOF;
  if(arguments.length == 1){
    passedRNG = new Well19937c();
    passedDOF = rng;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 2){//(DOF, inverseCumAccuracy)
    passedRNG = new Well19937c();
    passedDOG = rng;
    solverAbsoluteAccuracy = degreeOfFreedom;
  }else{//all 3
    passedRNG = rng;
    passedDOF = degreeOfFreedom;
    solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  if(passedDOF <= 0){throw new NotStrictlyPositiveException(LocalizedFormats.DEGREES_OF_FREEDOM,degreesOfFreedom);}
  this.degreesOfFreedom = passedDOF;
}

TDistribution.prototype.getDegreesOfFreedom = function() {return this.degreesOfFreedom;};

TDistribution.prototype.density = function (x) {
  var n = this.degreesOfFreedom;
  var nPlus1Over2 = (n + 1) / 2;
  return Math.exp(Gamma.logGamma(nPlus1Over2) -
                      0.5 * (Math.log(Math.PI) +
                             Math.log(n)) -
                      Gamma.logGamma(n / 2) -
                      nPlus1Over2 *  Math.log(1 + x * x / n));
};
TDistribution.prototype.cumulativeProbability = function(x) {
    var ret;
    if (x === 0) {
        ret = 0.5;
    } else {
        var t =
            Beta.regularizedBeta(
                this.degreesOfFreedom / (this.degreesOfFreedom + (x * x)),
                0.5 * this.degreesOfFreedom,
                0.5);
        if (x < 0.0) {
            ret = 0.5 * t;
        } else {
            ret = 1.0 - 0.5 * t;
        }
    }

    return ret;
};

//@Override
TDistribution.prototype.getSolverAbsoluteAccuracy = function() {return solverAbsoluteAccuracy;};
TDistribution.prototype.getNumericalMean = function() {
  var df = this.getDegreesOfFreedom();

  if (df > 1) {
      return 0;
  }

  return Number.NaN;
};

TDistribution.prototype.getNumericalVariance = function() {
  var df = this.getDegreesOfFreedom();

  if (df > 2) {
      return df / (df - 2);
  }

  if (df > 1 && df <= 2) {
      return Number.POSITIVE_INFINITY;
  }

  return Number.NaN;
};

TDistribution.prototype.getSupportLowerBound = function() {return Number.NEGATIVE_INFINITY;};
TDistribution.prototype.getSupportUpperBound = function(){ return Number.POSITIVE_INFINITY; };
TDistribution.prototype.isSupportLowerBoundInclusive = function(){ return false; };
TDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false; };
TDistribution.prototype.isSupportConnected = function(){ return true; };
