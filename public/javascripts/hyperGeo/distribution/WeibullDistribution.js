// /*
// Radhika Mattoo, February 2016 N.Y.
//
// Porting Sungear from Java to Javascript,
// Translated from Ilyas Mounaime's Java code
//
var AbstractRealDistribution = require("./AbstractRealDistribution");
var OutOfRangeException = require("../exception/OutOfRangeException");
var Gamma = require("../special/Gamma");
var seedrandom = require("seedrandom");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");


WeibullDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1e-9;

function WeibullDistribution(rng, alpha, beta, inverseCumAccuracy){
    var passedAlpha;
    var passedBeta;
    if(arguments.length == 2){
        passedAlpha = rng;
        passedBeta = alpha;
        this.solverAbsoluteAccuracy = WeibullDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
        AbstractRealDistribution.call(this, seedrandom());
    }else if(arguments.length == 3){
        passedAlpha = rng;
        passedBeta = alpha;
        this.solverAbsoluteAccuracy = beta;
        AbstractRealDistribution.call(this, seedrandom());
    }else{
        AbstractRealDistribution.call(this, rng);
        passedBeta = beta;
        passedAlpha = alpha;
        this.solverAbsoluteAccuracy = inverseCumAccuracy;
    }
    if(passedAlpha <= 0){
        throw new NotStrictlyPositiveException(LocalizedFormats.SHAPE, passedAlpha);
    }
    if(passedBeta <= 0){
        throw new NotStrictlyPositiveException(LocalizedFormats.SCALE, passedBeta);
    }
    this.scale = passedBeta;
    this.shape = passedAlpha;
    this.numericalMean = Number.NaN;
    this.numericalMeanIsCalculated = false;
    this.numericalVariance = Number.NaN;
    this.numericalVarianceIsCalculated = false;

}

WeibullDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
WeibullDistribution.prototype.constructor = WeibullDistribution;


 WeibullDistribution.prototype = {
    constructor: WeibullDistribution,
     getShape: function(){
        return this.shape;
     },
     getScale: function(){
         return this.scale;
     },
     density: function(x){
         if(x < 0){
             return 0;
         }
         var xscale = x/this.scale;
         var xscalepow = Math.pow(xscale, this.shape-1);
         var xscalepowshape = xscalepow * xscale;

         return (this.shape/this.scale) * xscalepow * Math.exp(-xscalepowshape);
     },
     cumulativeProbability: function(x){
         var ret;
         if(x <= 0.0){
             ret = 0.0;
         }else{
             ret = 1.0 - Math.exp(- Math.pow((x/this.scale), this.shape));
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
             ret = this.scale * Math.pow(-Math.log(1.0-p), (1.0/this.shape));
         }
         return ret;
     },
     getSolverAbsoluteAccuracy: function(){
         return this.solverAbsoluteAccuracy;
     },
     getNumericalMean: function(){
         if(!this.numericalMeanIsCalculated){
             this.numericalMean = this.calculateNumericalMean();
             this.numericalMeanIsCalculated = true;
         }
         return this.numericalMean;
     },
     calculateNumericalMean: function () {
         var sh = this.getShape();
         var sc = this.getScale();
         return sc * Math.exp(Gamma.logGamma(1 + (1 / sh)));
     },
     getNumericalVariance: function(){
         if(!this.numericalVarianceIsCalculated){
             this.numericalVariance = this.calculateNumericalVariance();
             this.numericalVarianceIsCalculated = true;
         }
         return this.numericalVariance;
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
         return true;
     }
 };

module.exports = WeibullDistribution;
