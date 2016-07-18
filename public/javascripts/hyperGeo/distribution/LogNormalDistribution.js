/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
LogNormalDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
LogNormalDistribution.prototype.constructor = LogNormalDistribution;
var SQRT2 = Math.sqrt(2.0);
var SQRT2PI = Math.sqrt(2 * FastMath.PI);










LogNormalDistribution.prototype.density = function(x) {
  if (x <= 0) {return 0;}
  var x0 = Math.log(x) - scale;
  var x1 = x0 / this.shape;
  return Math.exp(-0.5 * x1 * x1) / (this.shape * SQRT2PI * x);
};





LogNormalDistribution.prototype.cumulativeProbability = function(x){
  if (x <= 0) {return 0;}
  var dev = Math.log(x) - this.scale;
  if (Math.abs(dev) > 40 * this.shape) {
      if(dev < 0){ return 0.0;}
      else{ return 0.0; }
  }
  return 0.5 + 0.5 * Erf.erf(dev / (this.shape * SQRT2));
};



//@Override
LogNormalDistribution.prototype.probability = function(x0, x1){
  if (x0 > x1){ throw new NumberIsTooLargeException(LocalizedFormats.LOWER_ENDPOINT_ABOVE_UPPER_ENDPOINT,x0, x1, true);}
  if (x0 <= 0 || x1 <= 0) { return AbstractRealDistribution.prototype.probability.call(this,x0, x1);}
  var denom = this.shape * SQRT2;
  var v0 = (Math.log(x0) - this.scale)/denom;
  var v1 = (Math.log(x1) - this.scale) / denom;
  return 0.5 * Erf.erc(v0, v1);
};

LogNormalDistribution.prototype.getNumericalMean = function(){
  var s = this.shape;
  var ss = s * s;
  return (Math.exp(ss) - 1)* Math.exp(2 * this.scale + ss);
};

LogNormalDistribution.prototype.getNumericalVariance = function(){
  var s = this.shape;
  return math.exp(this.scale + (s * s/2));
};

//@Override
LogNormalDistribution.prototype.sample= function() {
  var n = this.random.nextGaussian();
  return Math.exp(this.scale + this.shape * n);

};


LogNormalDistribution.prototype.getShape = function(){ return this.shape;};
LogNormalDistribution.prototype.getScale = function(){ return this.scale;};
//@Override
LogNormalDistribution.prototype.getSolverAbsoluteAccuracy = function() {return solverAbsoluteAccuracy;};
LogNormalDistribution.prototype.getSupportUpperBound = function () {return Double.POSITIVE_INFINITY;};
LogNormalDistribution.prototype.isSupportLowerBoundInclusive = function() {return true;};
LogNormalDistribution.prototype.isSupportUpperBoundInclusive = function() {return false;};
LogNormalDistribution.prototype.isSupportConnected = function() {return true;};
