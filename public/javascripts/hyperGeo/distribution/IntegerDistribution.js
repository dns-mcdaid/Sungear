/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

  function IntegerDistribution(){}
  IntegerDistribution.prototype.probability = function(x){};
  IntegerDistribution.prototype.cumulativeProbability = function(x0,x1){};
  IntegerDistribution.prototype.inverseCumulativeProbability = function(p){};
  IntegerDistribution.prototype.getNumericalMean = function(){};
  IntegerDistribution.prototype.getNumericalVariance = function(){};
  IntegerDistribution.prototype.getSupportLowerBound = function(){};
  IntegerDistribution.prototype.getSupportUpperBound = function(){};
  IntegerDistribution.prototype.isSupportConnected = function(){};
  IntegerDistribution.prototype.reseedRandomGenerator = function(seed){};
  IntegerDistribution.prototype.sample = function(sampleSize){};

module.exports = IntegerDistribution;