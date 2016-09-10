/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var ArithmeticUtils = require("../util/ArithmeticUtils");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var OutOfRangeException = require("../exception/OutOfRangeException");
var AbstractIntegerDistribution = require("./AbstractIntegerDistribution");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");
var seedrandom = require("seedrandom");
var Beta = require("../special/Beta");

PascalDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
PascalDistribution.prototype.constructor = PascalDistribution;

function PascalDistribution(rng, r, p){
  var passedRNG;
  var passedR;
  var passedP;
  if(arguments.length == 2){
    passedRNG = seedrandom();
    passedR = rng;
    passedP = r;
  }else{
    passedRNG = rng;
    passedR = r;
    passedP = p;
  }
  AbstractIntegerDistribution.call(this, passedRNG);
  if(r <= 0){throw new NotStrictlyPositiveException(LocalizedFormats.NUMBER_OF_SUCCESSES,r);}
  if(p < 0 || p > 1){throw new OutOfRangeException(p, 0, 1);}
  this.numberOfSuccesses = passedR;
  this.probabilityOfSuccess = passedP;
}

PascalDistribution.prototype.getNumberOfSuccesses = function() {return this.numberOfSuccesses;};
PascalDistribution.prototype.getProbabilityOfSuccess = function() {return this.probabilityOfSuccess;};
PascalDistribution.prototype.probability = function(x) {
  var ret;
  if (x < 0) {
      ret = 0.0;
  } else {
      ret = ArithmeticUtils.binomialCoefficientDouble(x +
              this.numberOfSuccesses - 1, this.numberOfSuccesses - 1) *
            Math.pow(this.probabilityOfSuccess, this.numberOfSuccesses) *
            Math.pow(1.0 - this.probabilityOfSuccess, x);
  }
  return ret;
};

PascalDistribution.prototype.cumulativeProbability = function(x) {
  var ret;
  if (x < 0) {
    ret = 0.0;
  } else {
      ret = Beta.regularizedBeta(this.probabilityOfSuccess,
          this.numberOfSuccesses, x + 1.0);
  }
  return ret;
};

PascalDistribution.prototype.getNumericalMean = function() {
  var p = this.getProbabilityOfSuccess();
  var r = this.getNumberOfSuccesses();
  return (r * (1 - p)) / p;
};

PascalDistribution.prototype.getNumericalVariance = function() {
  var p = this.getProbabilityOfSuccess();
  var r = this.getNumberOfSuccesses();
  return r * (1 - p) / (p * p);
};
PascalDistribution.prototype.getSupportLowerBound = function() {return 0;};
PascalDistribution.prototype.getSupportUpperBound = function() {return Number.MAX_VALUE;};
PascalDistribution.prototype.isSupportConnected = function() {return true;};


module.exports = PascalDistribution;