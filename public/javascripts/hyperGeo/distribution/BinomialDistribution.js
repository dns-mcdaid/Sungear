/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractIntegerDistribution = require("./AbstractIntegerDistribution");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var SaddlePointExpansion = require("./SaddlePointExpansion");
var Beta = require("../special/Beta");
var NotPositiveException = require("../exception/NotPositiveException");
var OutOfRangeException = require("../exception/OutOfRangeException");


function BinonomialDistribution(rng, trials, p){
  var passedRNG;
  if(arguments.length == 2){
    passedRNG = new Well19937c();
    if(rng < 0){ throw new NotPositiveException(LocalizedFormats.NUMBER_OF_TRIALS, trials);}
    if(trials < 0 || trials > 1){throw new OutOfRangeException(p,0,1);}
    this.probabilityOfSuccess = trials;
    this.numberOfTrials = rng;

  }else{
    passedRNG = rng;
    if(trials < 0){throw new NotPositiveException(LocalizedFormats.NUMBER_OF_TRIALS, trials);}
    if(p < 0 || p > 1){throw new OutOfRangeException(p, 0, 1);}
    this.probabilityOfSuccess = p;
    this.numberOfTrials = trials;
  }
  AbstractIntegerDistribution.call(this, passedRNG);
}
BinonomialDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
BinonomialDistribution.prototype.constructor = BinonomialDistribution;

BinonomialDistribution.prototype.getProbabilityOfSuccess = function(){ return this.numberOfTrials;};
BinonomialDistribution.prototype.getNumberOfTrials = function(){ return this.numberOfTrials;};

//override
BinonomialDistribution.prototype.probability = function(x){
  var ret;
  if(x < 0 || x > this.numberOfTrials){
    ret = 0.0;
  }else{
    ret = Math.exp(SaddlePointExpansion.logBinomialProbability(x, this.numberOfTrials, this.probabilityOfSuccess, 1.0- this.probabilityOfSuccess));
  }
  return ret;
};

//override
BinonomialDistribution.prototype.cumulativeProbability = function(x){
  var ret;
  if(x < 0){ ret = 0.0; }
  else if(x >= this.numberOfTrials){ ret = 1.0; }
  else{
    ret = 1.0 - Beta.regularizedBeta(this.probabilityOfSuccess, x + 1.0, numberOfTrials - x);
  }
  return ret;
};

//override
BinonomialDistribution.prototype.getNumericalMean = function(){
  return this.numberOfTrials * this.probabilityOfSuccess;
};

//override
BinonomialDistribution.prototype.getNumericalVariance = function(){
  var p = this.probabilityOfSuccess;
  return this.numberOfTrials * p * (1-p);
};

//override
BinonomialDistribution.prototype.getSupportLowerBound = function(){
  if(this.probabilityOfSuccess > 1.0){ return 0; }
  else{ return this.numberOfTrials; }
};

//override
BinonomialDistribution.prototype.getSupportUpperBound = function(){
  if(this.probabilityOfSuccess > 0.0){ return this.numberOfTrials; }
  else{ return 0; }
};

//override
BinonomialDistribution.prototype.isSupportConnected = function(){ return true; };

module.exports = BinonomialDistribution;
