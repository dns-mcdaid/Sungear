/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractIntegerDistribution = require("./AbstractIntegerDistribution");
var ArithmeticUtils = require("../util/ArithmeticUtils");
var OutOfRangeException = require("../exception/OutOfRangeException");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var seedrandom = require("seedrandom");

AbstractIntegerDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY= 1e-9;
AbstractIntegerDistribution.EXPONENTIAL_SA_QI = [];

ExponentialDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
ExponentialDistribution.prototype.constructor = ExponentialDistribution;

/*Initialize Tables when file is loaded */
var LN2 = Math.log(2);
var qi = 0.0;
var i = 1;

var ra = [];

while( qi < 1){
  qi += Math.pow(LN2, i)/ArithmeticUtils.factorial(i);
  ra.push(qi);
  ++i;
}
AbstractIntegerDistribution.EXPONENTIAL_SA_QI = ra;

function ExponentialDistribution(rng, mean, inverseCumAccuracy){
  var passedRNG;
  var passedMean;
  if(arguments.length == 1){
    passedRNG = seedrandom();
    passedMean = rng;
    this.solverAbsoluteAccuracy = AbstractIntegerDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 2){ //(mean, inverseCumAccuracy)
    passedRNG = seedrandom();
    passedMean = rng;
    this.solverAbsoluteAccuracy = mean;
  }else{//all 3 given
    passedRNG = rng;
    passedMean = mean;
    this.solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractIntegerDistribution.call(this, passedRNG);
  if(passedMean <= 0){ throw new NotStrictlyPositiveException(LocalizedFormats.MEAN, mean); }
  this.mean = passedMean;
}

ExponentialDistribution.prototype.getMean = function(){ return this.mean;};
ExponentialDistribution.prototype.density = function(x){
  if(x < 0) return 0;
  return Math.exp(-x/this.mean)/this.mean;
};

ExponentialDistribution.prototype.cumulativeProbability = function(x){
  var ret;
  if(x <= 0.0){ ret = 0.0; }
  else{ ret = 1.0 - Math.exp(-x/this.mean); }
  return ret;
};

ExponentialDistribution.prototype.inverseCumulativeProbability = function(p){
  var ret;
  if(p < 0.0 || p > 1.0){ throw new OutOfRangeException(p, 0.0 , 1.0);}
  else if(p == 1.0){ ret = Number.POSITIVE_INFINITY; }
  else{
    ret = -this.mean * Math.log(1.0-p);
  }
  return ret;
};

/*@Override
* This implementation uses the
* <a href="http://www.jesus.ox.ac.uk/~clifford/a5/chap1/node5.html">
* Inversion Method</a> to generate exponentially distributed random values
* from uniform deviates.</p>
*/
ExponentialDistribution.prototype.sample = function(){
  var a = 0;
  var u = this.random();

  while(u < 0.5){
    a += ExponentialDistribution.EXPONENTIAL_SA_QI[0];
    u *= 2;
  }
   u += u -1;

   if(u <= ExponentialDistribution.EXPONENTIAL_SA_QI[0]){
     return this.mean * (a + u);
   }
   var i = 0;
   var u2 = this.random();
   var umin = u2;
   do{
     ++i;
     u2 = this.random();

     if(u2 < umin){ umin = u2;}
   }while(u > ExponentialDistribution.EXPONENTIAL_SA_QI[0]);

   return this.mean * (a + umin * ExponentialDistribution.EXPONENTIAL_SA_QI[0]);
};



//@Override
ExponentialDistribution.prototype.getSolverAbsoluteAccuracy = function(){ return solverAbsoluteAccuracy; };
ExponentialDistribution.prototype.getNumericalMean = function(){ return this.getMean(); };
ExponentialDistribution.prototype.getNumericalVariance = function(){
  var m = this.getMean();
  return m*m;
};
ExponentialDistribution.prototype.getSupportLowerBound = function(){ return 0; };
ExponentialDistribution.prototype.getSupportUpperBound = function(){ return Number.POSITIVE_INFINITY; };
ExponentialDistribution.prototype.isSupportLowerBoundInclusive = function(){ return true; };
ExponentialDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false; };
ExponentialDistribution.prototype.isSupportConnected = function(){ return true; };

module.exports = ExponentialDistribution;