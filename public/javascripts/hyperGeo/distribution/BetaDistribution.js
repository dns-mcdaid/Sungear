/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
var AbstractRealDistribution = require("./AbstractRealDistribution");
var Gamma = require("../special/Gamma");

BetaDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
BetaDistribution.prototype.constructor = BetaDistribution;

var z;
var solverAbsoluteAccuracy;


function BetaDistribution(rng, alpha, beta, inverseCumAccuracy){
  var passedRNG;
  if(arguments.length == 2){ //(alpha, beta)
    this.alpha = rng;
    this.beta = alpha;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
    passedRNG = new Well19937c();

  }
  else if(arguments.length == 3){ //(alpha, beta, inverseCumAccuracy)
    passedRNG = new Well19937c();
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
  z = Number.NaN;

}

BetaDistribution.prototype.getAlpha = function(){
  return this.alpha;
};
BetaDistribution.prototype.getBeta = function(){
  return this.beta;
};

BetaDistribution.prototype.recomputeZ= function(){
  if(Number.isNan(z)){
    z = Gamma.logGamma(alpha) + Gamma.logGamma(beta) - Gamma.logGamma(alpha + beta);
  }
};

BetaDistribution.prototype.density = function(x){
  this.recomputeZ();
  if( x < 0 || x > 1){
    return 0;
  }else if(x === 0){
    if(alpha < 1){
      throw new NumberIsTooSmallException(LocalizedFormats.CANNOT_COMPUTE_BETA_DENSITY_AT_0_FOR_SOME_ALPHA, alpha, 1, false);
    }
    return 0;
  }else if(x == 1){
    if (beta < 1){
      throw new NumberIsTooSmallException(LocalizedFormats.CANNOT_COMPUTE_BETA_DENSITY_AT_1_FOR_SOME_BETA, beta, 1, false);
    }
    return 0;
  }else{
    var logX = FastMathLog(x);
    var log1mX = FastMathLog1p(-x);
    return FastMathExp((this.alpha-1) * logX + (this.beta-1) * log1mX - z);
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
  var a = getAlpha();
  return a/(a + getBeta());
}

function getNumericalVariance(){
  var a = getAlpha();
  var b = getbeta();
  var alphabetasum = a+b;
  return (a * b) / ((alphabetasum * alphabetasum) * (alphabetasum + 1));
}

BetaDistribution.prototype.getSupportUpperBound = function(){ return 1; };
BetaDistribution.prototype.isSupportLowerBoundInclusive = function(){ return false; };
BetaDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false; };
BetaDistribution.prototype.isSupportConnected = function(){ return true; };

module.exports = BetaDistribution;
