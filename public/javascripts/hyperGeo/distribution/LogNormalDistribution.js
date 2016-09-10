/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractRealDistribution = require("./AbstractRealDistribution");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var NumberIsTooLargeException = require('../exception/NumberIsTooLargeException');
var Erf = require("../special/Erf");

LogNormalDistribution.prototype = Object.create(AbstractRealDistribution.prototype);
LogNormalDistribution.prototype.constructor = LogNormalDistribution;


LogNormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY = 1E-9;
LogNormalDistribution.SQRT2PI = Math.sqrt(2 * Math.PI);
LogNormalDistribution.SQRT2 = Math.sqrt(2);

function LogNormalDistribution(passedRNG, passedScale, passedShape, passedAccuracy){
  var rng;
  this.shape;
  this.scale;
  this.solverAbsoluteAccuracy;
  if(arguments.length == 0){
    this.scale = 0;
    this.shape = 1;
    this.solverAbsoluteAccuracy = LogNormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;
    rng = seedrandom();

  }else if(arguments.length == 2){
    this.scale = passedRNG;
    this.shape = passedScale;
    this.solverAbsoluteAccuracy = LogNormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY;

  }else if (arguments.length == 3){
    this.scale = passedRNG;
    this.shape = passedScale;
    this.solverAbsoluteAccuracy = passedShape;
    rng = seedrandom();
  }else{
    rng = passedRNG;
    this.scale = passedScale;
    this.shape = passedShape;
    this.solverAbsoluteAccuracy = passedAccuracy;
  }
  AbstractRealDistribution.call(this, rng);
  if(this.shape <= 0){
    throw new NotStrictlyPositiveException(LocalizedFormats.SHAPE, this.shape);
  }
}

LogNormalDistribution.prototype = {
  getScale: function(){
    return this.scale;
  },
  getShape: function(){
      return this.shape;
  },
  density : function(x) {
  if (x <= 0) {return 0;}
  var x0 = Math.log(x) - scale;
  var x1 = x0 / this.shape;
  return Math.exp(-0.5 * x1 * x1) / (this.shape * LogNormalDistribution.SQRT2PI * x);
  },
  cumulativeProbability : function(x){
  if (x <= 0) {return 0;}
  var dev = Math.log(x) - this.scale;
  if (Math.abs(dev) > 40 * this.shape) {
    if(dev < 0){ return 0.0;}
    else{ return 0.0; }
  }
  return 0.5 + 0.5 * Erf.erf(dev / (this.shape * LogNormalDistribution.SQRT2));
},
    probability : function(x0, x1){
    if (x0 > x1){ throw new NumberIsTooLargeException(LocalizedFormats.LOWER_ENDPOINT_ABOVE_UPPER_ENDPOINT,x0, x1, true);}
    if (x0 <= 0 || x1 <= 0) { return AbstractRealDistribution.prototype.probability.call(this,x0, x1);}
    var denom = this.shape * LogNormalDistribution.SQRT2;
    var v0 = (Math.log(x0) - this.scale)/denom;
    var v1 = (Math.log(x1) - this.scale) / denom;
    return 0.5 * Erf.erf(v0, v1);
},
    getNumericalMean : function(){
    var s = this.shape;
    var ss = s * s;
    return (Math.exp(ss) - 1)* Math.exp(2 * this.scale + ss);
},
    getNumericalVariance : function(){
    var s = this.shape;
    return Math.exp(this.scale + (s * s/2));
},
    sample:  function() {
    var n = this.random();
    return Math.exp(this.scale + this.shape * n);
    }

};

LogNormalDistribution.prototype.getShape = function(){ return this.shape;};
LogNormalDistribution.prototype.getScale = function(){ return this.scale;};
LogNormalDistribution.prototype.getSolverAbsoluteAccuracy = function() {return this.solverAbsoluteAccuracy;};
LogNormalDistribution.prototype.getSupportUpperBound = function () {return Number.POSITIVE_INFINITY;};
LogNormalDistribution.prototype.isSupportLowerBoundInclusive = function() {return true;};
LogNormalDistribution.prototype.isSupportUpperBoundInclusive = function() {return false;};
LogNormalDistribution.prototype.isSupportConnected = function() {return true;};
