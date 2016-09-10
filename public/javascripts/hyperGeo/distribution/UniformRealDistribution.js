/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractRealDistribution = require("./AbstractRealDistribution");
var seedrandom = require("seedrandom");
var NumberIsTooLargeException = require("../exception/NumberIsTooLargeException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");

UniformRealDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
UniformRealDistribution.prototype.constructor = UniformRealDistribution;

UniformRealDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function UniformRealDistribution(rng, lower, upper, inverseCumAccuracy){
  var passedRNG;
  var passedLower;
  var passedUpper;
  if(arguments.length == 2){
    passedRNG = seedrandom();
    passedLower = rng;
    passedUpper = lower;
      this.solverAbsoluteAccuracy = UniformRealDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 3){
    passedRNG = seedrandom();
    passedLower = rng;
    passedUpper = lower;
      this.solverAbsoluteAccuracy = upper;
  }else{//all 4
    passedRNG = rng;
    passedLower = lower;
    passedUpper = upper;
    this.solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  if(passedLower >= passedUpper){throw new NumberIsTooLargeException(LocalizedFormats.LOWER_BOUND_NOT_BELOW_UPPER_BOUND,passedLower, passedUpper, false);}
  this.lower = passedLower;
  this.upper = passedUpper;
}

UniformRealDistribution.prototype = {


 density: function (x){
    if (x < this.lower || x > this.upper) {
        return 0.0;
    }
    return 1 / (this.upper - this.lower);
},

/** {@inheritDoc} */
 cumulativeProbability: function(x)  {
    if (x <= this.lower) {
        return 0;
    }
    if (x >= this.upper) {
        return 1;
    }
    return (x - this.lower) / (this.upper - this.lower);
},

/** {@inheritDoc} */
 getSolverAbsoluteAccuracy: function() {
    return this.solverAbsoluteAccuracy;
},

/**
 * {@inheritDoc}
 *
 * For lower bound {@code lower} and upper bound {@code upper}, the mean is
 * {@code 0.5 * (lower + upper)}.
 */
  getNumericalMean: function() {
    return 0.5 * (this.lower + this,upper);
},

/**
 * {@inheritDoc}
 *
 * For lower bound {@code lower} and upper bound {@code upper}, the
 * variance is {@code (upper - lower)^2 / 12}.
 */
 getNumericalVariance: function() {
    var ul = this.upper - this.lower;
    return ul * ul / 12;
},

/**
 * {@inheritDoc}
 *
 * The lower bound of the support is equal to the lower bound parameter
 * of the distribution.
 *
 * @return lower bound of the support
 */
  getSupportLowerBound: function() {
    return this.lower;
},

/**
 * {@inheritDoc}
 *
 * The upper bound of the support is equal to the upper bound parameter
 * of the distribution.
 *
 * @return upper bound of the support
 */
 getSupportUpperBound: function() {
    return this.upper;
},

/** {@inheritDoc} */
 isSupportLowerBoundInclusive: function() {
    return true;
},

/** {@inheritDoc} */
 isSupportUpperBoundInclusive: function() {
    return true;
},

/**
 * {@inheritDoc}
 *
 * The support of this distribution is connected.
 *
 * @return {@code true}
 */
 isSupportConnected: function() {
    return true;
},

/** {@inheritDoc} */
sample: function() {
    var u = random();
    return u * this.upper + (1 - u) * this.lower;
}
};

module.exports = UniformRealDistribution;