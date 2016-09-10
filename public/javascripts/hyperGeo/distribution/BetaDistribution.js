/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractRealDistribution = require("./AbstractRealDistribution");
var Gamma = require("../special/Gamma");
var seedrandom = require("seedrandom");
var Beta = require("../special/Beta");
var NumberIsTooSmallException = require("../exception/NumberIsTooSmallException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var FastMath = require("../util/FastMath");

//static variables
BetaDistribution.z;
BetaDistribution.solverAbsoluteAccuracy;
BetaDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function BetaDistribution(rng, alpha, beta, inverseCumAccuracy){
  var passedRNG;
  if(arguments.length == 2){ //(alpha, beta)
    this.alpha = rng;
    this.beta = alpha;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
    passedRNG = seedrandom();

  }
  else if(arguments.length == 3){ //(alpha, beta, inverseCumAccuracy)
    passedRNG = seedrandom();
    this.alpha = rng;
    this.beta = alpha;
    solverAbsoluteAccuracy = beta;


  }else{//(rng, alpha, beta, inversecumAccuracy))
    passedRNG = rng;
    solverAbsoluteAccuracy = inversecumAccuracy;
    this.alpha = alpha;
    this.beta = beta;
  }
  AbstractRealDistribution.call(this, passedRNG);
  BetaDistribution.z = Number.NaN;

}


//inheritance
BetaDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
BetaDistribution.prototype.constructor = BetaDistribution;


BetaDistribution.prototype.getAlpha = function(){
  return this.alpha;
};
BetaDistribution.prototype.getBeta = function(){
  return this.beta;
};

BetaDistribution.prototype.recomputeZ= function(){
  if(isNaN(z)){
    BetaDistribution.z = Gamma.logGamma(this.alpha) + Gamma.logGamma(this.beta) - Gamma.logGamma(this.alpha +this.beta);
  }
};

BetaDistribution.prototype.density = function(x){
  this.recomputeZ();
  if( x < 0 || x > 1){
    return 0;
  }else if(x === 0){
    if(alpha < 1){
      throw new NumberIsTooSmallException(LocalizedFormats.CANNOT_COMPUTE_BETA_DENSITY_AT_0_FOR_SOME_ALPHA, this.alpha, 1, false);
    }
    return 0;
  }else if(x == 1){
    if (this.beta < 1){
      throw new NumberIsTooSmallException(LocalizedFormats.CANNOT_COMPUTE_BETA_DENSITY_AT_1_FOR_SOME_BETA, this.beta, 1, false);
    }
    return 0;
  }else{
    var logX = Math.log(x);
    var log1mX = FastMath.Log1p(-x);
    return Math.exp((this.alpha-1) * logX + (this.beta-1) * log1mX - z);
  }
};//function


BetaDistribution.prototype.cumulativeProbability = function(x){
  if(x <= 0){
    return 0;
  }else if(x >= 1){
    return 1;
  }else{
    return Beta.regularizedBeta(x, this.alpha, this.beta);
  }
};

function getSolverAbsoluteAccuracy(){
  return solverAbsoluteAccuracy;
}

function getNumericalMean(){
  var a = this.getAlpha();
  return a/(a + this.getBeta());
}

function getNumericalVariance(){
  var a = this.getAlpha();
  var b = this.getBeta();
  var alphabetasum = a+b;
  return (a * b) / ((alphabetasum * alphabetasum) * (alphabetasum + 1));
}

BetaDistribution.prototype.getSupportUpperBound = function(){ return 1; };
BetaDistribution.prototype.isSupportLowerBoundInclusive = function(){ return false; };
BetaDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false; };
BetaDistribution.prototype.isSupportConnected = function(){ return true; };

module.exports = BetaDistribution;
