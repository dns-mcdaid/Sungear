/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
UniformRealDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
UniformRealDistribution.prototype.constructor = UniformRealDistribution;

var DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
var solverAbsoluteAccuracy;

function UniformRealDistribution(rng, lower, upper, inverseCumAccuracy){
  var passedRNG;
  var passedLower;
  var passedUpper;
  if(arguments.length == 2){
    passedRNG = new Well19937c();
    passedLower = rng;
    passedUpper = lower;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 3){
    passedRNG = new Well19937c();
    passedLower = rng;
    passedUpper = lower;
    solverAbsoluteAccuracy = upper;
  }else{//all 4
    passedRNG = rng;
    passedLower = lower;
    passedUpper = upper;
    solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractRealDistribution.call(this, passedRNG);
  if(passedLower >= passedUpper){throw new NumberIsTooLargeException(LocalizedFormats.LOWER_BOUND_NOT_BELOW_UPPER_BOUND,lower, upper, false);}
  this.lower = passedLower;
  this.upper = passedUpper;
}
//TODO

/** {@inheritDoc} */
function density(x) {
    if (x < lower || x > upper) {
        return 0.0;
    }
    return 1 / (upper - lower);
}

/** {@inheritDoc} */
function cumulativeProbability(x)  {
    if (x <= lower) {
        return 0;
    }
    if (x >= upper) {
        return 1;
    }
    return (x - lower) / (upper - lower);
}

/** {@inheritDoc} */
function getSolverAbsoluteAccuracy() {
    return solverAbsoluteAccuracy;
}

/**
 * {@inheritDoc}
 *
 * For lower bound {@code lower} and upper bound {@code upper}, the mean is
 * {@code 0.5 * (lower + upper)}.
 */
function  getNumericalMean() {
    return 0.5 * (lower + upper);
}

/**
 * {@inheritDoc}
 *
 * For lower bound {@code lower} and upper bound {@code upper}, the
 * variance is {@code (upper - lower)^2 / 12}.
 */
function getNumericalVariance() {
    var ul = upper - lower;
    return ul * ul / 12;
}

/**
 * {@inheritDoc}
 *
 * The lower bound of the support is equal to the lower bound parameter
 * of the distribution.
 *
 * @return lower bound of the support
 */
function  getSupportLowerBound() {
    return lower;
}

/**
 * {@inheritDoc}
 *
 * The upper bound of the support is equal to the upper bound parameter
 * of the distribution.
 *
 * @return upper bound of the support
 */
function getSupportUpperBound() {
    return upper;
}

/** {@inheritDoc} */
function isSupportLowerBoundInclusive() {
    return true;
}

/** {@inheritDoc} */
function isSupportUpperBoundInclusive() {
    return true;
}

/**
 * {@inheritDoc}
 *
 * The support of this distribution is connected.
 *
 * @return {@code true}
 */
function isSupportConnected() {
    return true;
}

/** {@inheritDoc} */
function sample()  {
    var u = random.nextDouble();
    return u * upper + (1 - u) * lower;
}
