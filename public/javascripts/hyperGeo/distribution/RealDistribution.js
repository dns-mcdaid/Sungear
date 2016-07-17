/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/



  function RealDistribution(){}
  RealDistribution.prototype.probability = function(x){};
  RealDistribution.prototype.density = function(x){};
  RealDistribution.prototype.cumulativeProbability = function(x){};
  RealDistribution.prototype.inverseCumulativeProbability = function(p){};
  RealDistribution.prototype.getNumericalMean = function(){};
  RealDistribution.prototype.getNumericalVariance = function(){};
  RealDistribution.prototype.getSupportLowerBound = function(){};
  RealDistribution.prototype.getSupportUpperBound = function(){};
  RealDistribution.prototype.isSupportConnected = function(){};
  RealDistribution.prototype.reseedRandomGenerator = function(seed){};
  RealDistribution.prototype.sample = function(sampleSize){};

module.exports = RealDistribution;
