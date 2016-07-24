/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//IMPLEMENT INHERITANCE
var MultivariateRealDistribution = require('./MultivariateRealDistribution');
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");

AbstractMultivariateRealDistribution.prototype = Object.create(MultivariateRealDistribution.prototype);
AbstractMultivariateRealDistribution.prototype.constructor = AbstractMultivariateRealDistribution;

function AbstractMultivariateRealDistribution(rng, n){
  this.rng = rng; //RandomGenerator
  this.dimension = n; //number of dimensions/columns in the multivaraite distribution
}
//overriding
AbstractMultivariateRealDistribution.prototype.reseedRandomGenerator = function(seed){
  this.rng.setSeed(seed); //FIXME: find online PRNG file
};

//overriding
AbstractMultivariateRealDistribution.prototype.getDimension = function(){
  return this.dimension;
};

//overriding
AbstractMultivariateRealDistribution.prototype.sample = function(sampleSize){
  if(arguments.length === 0){
    return null;
  }
  else{
    if(sampleSize <= 0){
      throw new NotStrictlyPositiveException(LocalizedFormats.NUMBER_OF_SAMPLES,
                                                   sampleSize);
    }
    var out = new Array(sampleSize);
    for(var i = 0; i < sampleSize; i++){
      out[i] = new Array(this.dimension);
    }
    return out;
  }
};

module.exports = AbstractMultivariateRealDistribution;
