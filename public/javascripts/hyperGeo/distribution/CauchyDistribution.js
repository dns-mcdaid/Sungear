/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var seedrandom = require("seedrandom");
var AbstractRealDistribution = require("./AbstractRealDistribution");
var OutOfRangeException = require("../exception/OutOfRangeException");

CauchyDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
CauchyDistribution.prototype.constructor = CauchyDistribution;

CauchyDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
CauchyDistribution.solverAbsoluteAccuracy;

function CauchyDistribution(rng, median, scale, inverseCumAccuracy){
  var passedRNG;
  if(arguments.length === 0){ //(median = 0, scale = 1)
    passedRNG = seedrandom();
    this.median = 0;
    this.scale = 1;
    this.inverseCumAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;

  }else if(arguments.length == 2){ //(median, scale)
    pssedRNG = seedrandom();
    this.median = rng;
    this.scale = median;
    this.inverseCumAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;

  }else if(arguments.length == 3){ //(median, scale, inverseCumAccuracy)
    passedRNG = seedrandom();
    this.median = rng;
    this.scale = median;
    this.inverseCumAccuracy = scale;
  }else{
    passedRNG = rng;
    this.median = median;
    this.scale = scale;
    this.inverseCumAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  solverAbsoluteAccuracy = this.inverseCumAccuracy;
}

//GETTERS
CauchyDistribution.prototype.getMedian = function(){ return this.median;};
CauchyDistribution.prototype.getScale = function(){ return this.scale; };

CauchyDistribution.prototype.density = function(x){
  var dev = x - this.median;
  return (1/Math.PI) * (this.scale/(dev * dev + this.scale * this.scale));
};

//@Override
CauchyDistribution.prototype.inverseCumulativeProbability = function(p){
  var ret;
  if(p < 0 || p > 1){ throw new OutOfRangeException(p,0,1);}
  else if(p === 0){ ret = Number.NEGATIVE_INFINITY; }
  else if(p === 1){ ret = Number.POSITIVE_INFINITY; }
  else{
    ret = this.median + this.scale * Math.tan(Math.PI * (p - 0.5));
  }
  return ret;
};

CauchyDistribution.prototype.cumulativeProbability = function(x){
  return 0.5 * (Math.atan((x - this.median)/this.scale)/ Math.PI);
};

//override
CauchyDistribution.prototype.getSolverAbsoluteAccuracy = function(){ return solverAbsoluteAccuracy; };
CauchyDistribution.prototype.getNumericalMean = function(){ return Number.NaN;};
CauchyDistribution.prototype.getSupportLowerBound = function(){ return Number.NEGATIVE_INFINITY;};
CauchyDistribution.prototype.getSupportUpperBound = function(){ return Number.POSITIVE_INFINITY;};
CauchyDistribution.prototype.isSupportLowerBoundInclusive = function(){ return false;};
CauchyDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false;};
CauchyDistribution.prototype.isSupportConnected = function(){ return true;};

module.exports = CauchyDistribution;