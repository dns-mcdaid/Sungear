// /*
// Radhika Mattoo, February 2016 N.Y.
//
// Porting Sungear from Java to Javascript,
// Translated from Ilyas Mounaime's Java code
//
var AbstractRealDistribution = require("./AbstractRealDistribution");
var OutOfRangeException = require("../exception/OutOfRangeException");
var Gamma = require("../special/Gamma");
var Well19937c = require("../random/Well19937c");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");


var DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;
var serialVersionUID = 8589540077390120676;
var numericalMean = Number.NaN;
var numericalMeanIsCalculated = false;
var numericalVariance = Number.NaN;
var numericalVarianceIsCalculated = false;
var shape;
var scale;
var solverAbsoluteAccuracy;

function WeibullDistribution(rng, alpha, beta, inverseCumAccuracy){
    var passedAlpha;
    var passedBeta;
    if(arguments.length == 2){
        passedAlpha = rng;
        passedBeta = alpha;
        solverAbsoluteAccuracy = DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
        AbstractRealDistribution.call(this, new Well19937c());
    }else if(arguments.length == 3){
        passedAlpha = rng;
        passedBeta = alpha;
        solverAbsoluteAccuracy = beta;
        AbstractRealDistribution.call(this, new Well19937c());
    }else{
        AbstractRealDistribution.call(this, rng);
        passedBeta = beta;
        passedAlpha = alpha;
        solverAbsoluteAccuracy = inverseCumAccuracy;
    }
    if(passedAlpha <= 0){
        throw new NotStrictlyPositiveException(LocalizedFormats.SHAPE, passedAlpha);
    }
    if(passedBeta <= 0){
        throw new NotStrictlyPositiveException(LocalizedFormats.SCALE, passedBeta);
    }
    scale = passedBeta;
    shape = passedAlpha;

}

WeibullDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
WeibullDistribution.prototype.constructor = WeibullDistribution;


 WeibullDistribution.prototype = {
    constructor: WeibullDistribution,
     getShape: function(){
        return shape;
     },
     getScale: function(){
         return scale;
     },
     density: function(x){
         if(x < 0){
             return 0;
         }
         var xscale = x/scale;
         var xscalepow = Math.pow(xscale, shape-1);
         var xscalepowshape = xscalepow * xscale;

         return (shape/scale) * xscalepow * Math.exp(-xscalepowshape);
     },
     cumulativeProbability: function(x){
         var ret;
         if(x <= 0.0){
             ret = 0.0;
         }else{
             ret = 1.0 - Math.exp(- Math.pow((x/scale), shape));
         }
         return ret;
     },
     inverseCumulativeProbability: function(p){
        var ret;
         if (p < 0.0 || p > 1.0){
             throw new OutOfRangeException(p, 0.0, 1.0);
         }else if(p == 0){
             ret = 0.0;
         }else if(p == 1){
             ret = Number.POSITIVE_INFINITY;
         }else{
             ret = scale * Math.pow(-Math.log(1.0-p), (1.0/shape));
         }
         return ret;
     },
     getSolverAbsoluteAccuracy: function(){
         return solverAbsoluteAccuracy;
     },
     getNumericalMean: function(){
         if(!numericalMeanIsCalculated){
            numericalMean = this.calculateNumericalMean();
             numericalMeanIsCalculated = true;
         }
         return numericalMean;
     },
     calculateNumericalMean: function () {
         var sh = this.getShape();
         var sc = this.getScale();
         return sc * Math.exp(Gamma.logGamma(1 + (1 / sh)));
     },
     getNumericalVariance: function(){
         if(!numericalVarianceIsCalculated){
             numericalVariance = this.calculateNumericalVariance();
             numericalVarianceIsCalculated = true;
         }
         return numericalVariance;
     },
     calculateNumericalVariance: function(){
         var sh = this.getShape();
         var sc = this.getScale();
         var mn = this.getNumericalMean();
         return (sc * sc) * Math.exp(Gamma.logGamma(1 + (2/sh))) - (mn * mn);
     },
     getSupportLowerBound: function(){
         return 0;
     },
     getSupportUpperBound: function(){
         return Number.POSITIVE_INFINITY;
     },
     isSupportLowerBoundInclusive: function(){
         return true;
     },
     isSupportUpperBoundInclusive: function(){
         return false;
     },
     isSupportConnected: function(){
         true;
     }
 };

module.exports = WeibullDistribution;
