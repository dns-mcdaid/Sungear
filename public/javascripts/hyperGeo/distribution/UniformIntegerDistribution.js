/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
UniformIntegerDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
UniformIntegerDistribution.prototype.constructor = UniformIntegerDistribution;

function UniformIntegerDistribution(rng, lower, upper){
  var passedRNG;
  var passedLower;
  var passedUpper;
  if(arguments.length == 2){
    passedRNG = new Well19937c();
    passedLower = rng;
    passedUpper = lower;
  }else if (arguments.length == 3){
    passedRNG = rng;
    passedLower = lower;
    passedUpper = upper;
  }
  AbstractIntegerDistribution.call(this, passedRNG);
  if(passedLower >= passedUpper){ throw new NumberIsTooLargeException(LocalizedFormats.LOWER_BOUND_NOT_BELOW_UPPER_BOUND,lower, upper, false); }
  this.lower = passedLower;
  this.upper = passedUpper;
}
UniformIntegerDistribution.prototype.probability = function(x){
  if (x < this.lower || x > this.upper) {
    return 0;
  }
  return 1.0 / (this.upper - this.lower + 1);
};
UniformIntegerDistribution.prototype.cumulativeProbability = function(x){
  if (x < this.lower) {
    return 0;
  }
  if (x > this.upper) {
      return 1;
  }
  return (x - this.lower + 1.0) / (this.upper - this.lower + 1.0);
};
UniformIntegerDistribution.prototype.getNumericalMean = function(){ return 0.5*(this.lower + this.upper);};
UniformIntegerDistribution.prototype.getNumericalVariance = function(){
  var n = this.upper - this.lower + 1;
  return (n * n - 1) / 12.0;
};
UniformIntegerDistribution.prototype.getSupportLowerBound = function(){ return this.lower;};
UniformIntegerDistribution.prototype.getSupportUpperBound = function(){ return this.upper;};
UniformIntegerDistribution.prototype.isSupportConnected = function(){ return true;};
UniformIntegerDistribution.prototype.sample = function(){
  var r = this.random.nextDouble();
  var scale = r * this.upper + (1-r) * this.lower + r;
  return Math.floor(scaled);
};
