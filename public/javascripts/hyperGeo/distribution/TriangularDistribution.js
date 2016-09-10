/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var NumberIsTooLargeException = require("../exception/NumberIsTooLargeException");
var OutOfRangeException = require("../exception/OutOfRangeException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var seedrandom = require("seedrandom");
var AbstractRealDistribution = require("./AbstractRealDistribution");
var FastMath = require("../util/FastMath");

//inheritance
TriangularDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
TriangularDistribution.prototype.constructor = TriangularDistribution;


function TriangularDistribution(rng, a, c, b){
  var passedRNG;
  var passedA;
  var passedB;
  var passedC;

  if(arguments.length == 3){ //(a,c,b)
    passedRNG = seedrandom();
    passedA = rng;
    passedC = a;
    passedB = b;
  }
  else if(arguments.length == 4){
    passedRNG = rng;
    passedA = a;
    passedC = c;
    passedB = b;
  }
  AbstractRealDistribution.call(this, passedRNG);
  if(passedA >= passedB){ throw new NumberIsTooLargeException(LocalizedFormats.LOWER_BOUND_NOT_BELOW_UPPER_BOUND,a, b, false);}
  if(passedC < passedA){ throw new NumberIsTooLargeException(LocalizedFormats.NUMBER_TOO_SMALL, c, a, true);}
  if(passedC > passedB){ throw new NumberIsTooLargeException(LocalizedFormats.NUMBER_TOO_LARGE, c, b, true);}
  this.a =  passedA;
  this.c = passedC;
  this.b = passedB;
  this.solverAbsoluteAccuracy = Math.max(FastMath.ULP(a), FastMath.ULP(b));
}

TriangularDistribution.prototype.getMode = function(){ return this.c; };
TriangularDistribution.prototype.getSolverAbsoluteAccuracy = function(){ return this.solverAbsoluteAccuracy;};



TriangularDistribution.prototype.density = function(x) {
  if (x < this.a) {
      return 0;
  }
  if (this.a <= x && x < this.c) {
      var divident = 2 * (x - this.a);
      var divisor = (this.b - this.a) * (this.c - this.a);
      return divident / divisor;
  }
  if (x == this.c) {
      return 2 / (this.b - this.a);
  }
  if (this.c < x && x <= this.b) {
      var divident = 2 * (this.b - x);
      var divisor = (this.b - this.a) * (this.b - this.c);
      return divident / divisor;
  }
  return 0;
};

TriangularDistribution.prototype.cumulativeProbability = function(x)  {
  if (x < this.a) {
      return 0;
  }
  if (this.a <= x && x < this.c) {
      var divident = (x - this.a) * (x - this.a);
      var divisor = (this.b - this.a) * (this.c - this.a);
      return divident / divisor;
  }
  if (x == this.c) {
      return (this.c - this.a) / (this.b - this.a);
  }
  if (this.c < x && x <= this.b) {
      var divident = (this.b - x) * (this.b - x);
      var divisor = (this.b - this.a) * (this.b - this.c);
      return 1 - (divident / divisor);
  }
  return 1;
};

TriangularDistribution.prototype.getNumericalMean = function() { return (this.a + this.b + this.c) / 3;};
TriangularDistribution.prototype.getNumericalVariance = function() {
  return (this.a * this.a + this.b * this.b + this.c * this.c - this.a * this.b - this.a * this.c - this.b * this.c) / 18;
};
TriangularDistribution.prototype.getSupportLowerBound = function() {return this.a;};
TriangularDistribution.prototype.getSupportUpperBound = function() {return this.b;};
TriangularDistribution.prototype.isSupportLowerBoundInclusive = function() {return true;};
TriangularDistribution.prototype.isSupportUpperBoundInclusive = function() {return true;};
TriangularDistribution.prototype.isSupportConnected = function() {return true;};

//@Override
TriangularDistribution.prototype.inverseCumulativeProbability = function(p){
        if (p < 0 || p > 1) {
            throw new OutOfRangeException(p, 0, 1);
        }
        if (p === 0) {
            return this.a;
        }
        if (p === 1) {
            return this.b;
        }
        if (p < (this.c - this.a) / (this.b - this.a)) {
            return this.a + Math.sqrt(p * (this.b - this.a) * (this.c - this.a));
        }
        return this.b - Math.sqrt((1 - p) * (this.b - this.a) * (this.b - this.c));
};

module.exports = TriangularDistribution;