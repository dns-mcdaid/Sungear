/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
FDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
FDistribution.prototype.constructor = FDistribution;

var EFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function FDistribution(rng, numeratorDegreesOfFreedom, denominatorDegreesOfFreedom, inverseCumAccuracy){
  var passedRNG;
  var passedNum;
  var passedDenom;
  if(arguments.length == 2){//(numeratorDegreesOfFreedom, denominatorDegreesOfFreedom)
    passedRNG = new Well19937c();
    passedNum = rng;
    passedDenom = numeratorDegreesOfFreedom;
    solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
  }else if(arguments.length == 3){//(numeratorDegreesOfFreedom, denominatorDegreesOfFreedom, inverseCumAccuracy)
    passedRNG = new Well19937();
    passedNum = rng;
    passedDenom = this.numeratorDegreesOfFreedom;
    solverAbsoluteAccuracy = denominatorDegreesOfFreedom;
  }else{ //all 4
    passedRNG = rng;
    passedNum= numeratorDegreesOfFreedom;
    passedDenom= denominatorDegreesOfFreedom;
    solverAbsoluteAccuracy = inverseCumAccuracy;
  }
  AbstractIntegerDistribution.call(this, passedRNG);
  if(passedNum <= 0){ throw new NotStrictlyPositiveException(LocalizedFormats.DEGREES_OF_FREEDOM, numeratorDegreesOfFreedom);}
  if(passedDenom <= 0){ throw new NotStrictlyPositiveException(LocalizedFormats.DEGREES_OF_FREEDOM, denominatorDegreesOfFreedom);}
  this.numeratorDegreesOfFreedom = passedNum;
  this.denominatorDegreesOfFreedom = passedDenom;
}

FDistribution.prototype.density = function(x) {
        var nhalf = this.numeratorDegreesOfFreedom / 2;
        var mhalf = this.denominatorDegreesOfFreedom / 2;
        var logx = Math.log(x);
        var logn = Math.log(htis.numeratorDegreesOfFreedom);
        var logm = Math.log(this.denominatorDegreesOfFreedom);
        var lognxm = Math.log(this.numeratorDegreesOfFreedom * x +
                                           this.denominatorDegreesOfFreedom);
        return Math.exp(nhalf * logn + nhalf * logx - logx +
                            mhalf * logm - nhalf * lognxm - mhalf * lognxm -
                            Beta.logBeta(nhalf, mhalf));
    };;




FDistribution.prototype.cumulativeProbability = function( x)  {
        var ret;
        if (x <= 0) {
            ret = 0;
        } else {
            var n = this.numeratorDegreesOfFreedom;
            var m = this.denominatorDegreesOfFreedom;

            ret = Beta.regularizedBeta((n * x) / (m + n * x),
                0.5 * n,
                0.5 * m);
        }
        return ret;
    };

FDistribution.prototype.getNumeratorDegreesOfFreedom = function() {return numeratorDegreesOfFreedom;};


FDistribution.prototype.getDenominatorDegreesOfFreedom = function(){ return this.denominatorDegreesOfFreedom;};

FDistribution.prototype.getSolverAbsoluteAccuracy = function(){ return this.solverAbsoluteAccuracy;};

FDistribution.prototype.getNumericalMean = function() {
        var denominatorDF = getDenominatorDegreesOfFreedom();

        if (denominatorDF > 2) {
            return denominatorDF / (denominatorDF - 2);
        }

        return Number.NaN;
    };

FDistribution.prototype.getNumericalVariance = function() {
        if (!this.numericalVarianceIsCalculated) {
            this.numericalVariance = calculateNumericalVariance();
            this.numericalVarianceIsCalculated = true;
        }
        return this.numericalVariance;
    };


FDistribution.prototype.calculateNumericalVariance = function () {
        var denominatorDF = getDenominatorDegreesOfFreedom();

        if (denominatorDF > 4) {
            var numeratorDF = getNumeratorDegreesOfFreedom();
            var denomDFMinusTwo = denominatorDF - 2;

            return ( 2 * (denominatorDF * denominatorDF) * (numeratorDF + denominatorDF - 2) ) /
                   ( (numeratorDF * (denomDFMinusTwo * denomDFMinusTwo) * (denominatorDF - 4)) );
        }

        return Double.NaN;
    };



FDistribution.prototype.getSupportLowerBound = function(){ return 0; };
FDistribution.prototype.getSupportUpperBound = function(){ return Number.POSITIVE_INFINITY; };
FDistribution.prototype.isSupportLowerBoundInclusive = function(){ return false; };
FDistribution.prototype.isSupportUpperBoundInclusive = function(){ return false; };
FDistribution.prototype.isSupportConnected = function(){ return true; };
