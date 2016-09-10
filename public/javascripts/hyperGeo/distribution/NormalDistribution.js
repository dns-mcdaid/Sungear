/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractRealDistribution = require("./AbstractRealDistribution");
var seedrandom = require("seedrandom");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var Erf = require("../special/Erf");
var NumberIsTooLargeException = require("../exception/NumberIsTooLargeException");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");


NormalDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
NormalDistribution.prototype.constructor = NormalDistribution;

NormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
NormalDistribution.SQRT2PI = Math.sqrt(2 * Math.PI);
NormalDistribution.SQRT2 = Math.sqrt(2.0);

function NormalDistribution(rng, mean, sd, inverseCumAccuracy){
  var passedRNG;
  var passedSD;
  if(arguments.length == 2){ //(mean, sd)
    passedRNG = seedrandom();
    this.mean = rng;
    passedSD = mean;
      this.solverAbsoluteAccuracy = NormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 3){//(mean, sd, inverseCumAccuracy)
    passedRNG = seedrandom();
    this.mean = rng;
    passedSD = mean;
      this.solverAbsoluteAccuracy = sd;
  }else{ //all 4
    passedRNG = rng;
    this.mean = mean;
    passedSD = sd;
      this.solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  if (passedSD <= 0) { throw new NotStrictlyPositiveException(LocalizedFormats.STANDARD_DEVIATION, passedSD);}
  this.standardDeviation = passedSD;
}


NormalDistribution.prototype.probability = function(x0,x1){
  if (x0 > x1) {throw new NumberIsTooLargeException(LocalizedFormats.LOWER_ENDPOINT_ABOVE_UPPER_ENDPOINT,x0, x1, true);}
  var denom = this.standardDeviation * NormalDistribution.SQRT2;
  var v0 = (x0 - this.mean) / denom;
  var v1 = (x1 - this.mean) / denom;
  return 0.5 * Erf.erf(v0, v1);
};

NormalDistribution.prototype.cumulativeProbability = function(x)  {
    var dev = x - this.mean;
    if (Math.abs(dev) > 40 * this.standardDeviation) {
        if(dev < 0){ return 0.0;}
        else {return 1.0;}
    }
    return 0.5 * (1 + Erf.erf(dev / (this.standardDeviation * NormalDistribution.SQRT2)));
};


NormalDistribution.prototype.density = function(x) {
    var x0 = x - this.mean;
    var x1 = x0 / this.standardDeviation;
    return Math.exp(-0.5 * x1 * x1) / (this.standardDeviation * NormalDistribution.SQRT2PI);
};

NormalDistribution.prototype.getNumericalVariance = function() {
    var s = this.getStandardDeviation();
    return s * s;
};
NormalDistribution.prototype.getSolverAbsoluteAccuracy = function() {return this.solverAbsoluteAccuracy;};
NormalDistribution.prototype.getNumericalMean = function() {return this.getMean();};
NormalDistribution.prototype.getStandardDeviation = function() {return this.standardDeviation;};
NormalDistribution.prototype.getMean = function() {return this.mean;};
NormalDistribution.prototype.getSupportLowerBound = function() {return Number.NEGATIVE_INFINITY;};
NormalDistribution.prototype.getSupportUpperBound = function () {return Number.POSITIVE_INFINITY;};
NormalDistribution.prototype.isSupportLowerBoundInclusive = function() {return false;};
NormalDistribution.prototype.isSupportUpperBoundInclusive = function() {return false;};
NormalDistribution.prototype.isSupportConnected = function() {return true;};
NormalDistribution.prototype.sample = function(){return this.standardDeviation * this.random() + this.mean;};

module.exports = NormalDistribution;