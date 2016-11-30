/*
Radhika Mattoo, February 2016  N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var SaddlePointExpansion = require("./SaddlePointExpansion");
var AbstractIntegerDistribution = require("./AbstractIntegerDistribution");
var seedrandom = require("seedrandom");
var Well19937c = require('../random/Well19937c');
var LocalizedFormats = require("../exception/util/LocalizedFormats");
var NotStrictlyPositiveException = require("../exception/NotStrictlyPositiveException");
var NotPositiveException = require("../exception/NotPositiveException");
var NumberIsTooLargeException = require("../exception/NumberIsTooLargeException");

//class vars
HypergeometricDistribution.numericalVarianceIsCalculated = false;
HypergeometricDistribution.numericalVariance = Math.NaN;

	//IMPLEMENT INHERITANCE
	HypergeometricDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
	HypergeometricDistribution.prototype.constructor = HypergeometricDistribution;

	function HypergeometricDistribution(populationSize, numberOfSuccesses, sampleSize, rng){
		var passedRNG;
		//ok so it doesn't really use the rng, just for calling the super class
    if(arguments.length < 4){
			passedRNG= new Well19937c();
		}else{
			passedRNG = rng;
		}

		if (populationSize <= 0) {
			throw NotStrictlyPositiveException(LocalizedFormats.POPULATION_SIZE,populationSize);
		}
		if (numberOfSuccesses < 0) {
		 	throw NotPositiveException(LocalizedFormats.NUMBER_OF_SUCCESSES, numberOfSuccesses);
		}
		if(sampleSize < 0){
		 	throw NotPositiveException(LocalizedFormats.NUMBER_OF_SAMPLES, sampleSize);
		}
		if(numberOfSuccesses > populationSize){
			throw NumberIsTooLargeException(LocalizedFormats.NUMBER_OF_SUCCESS_LARGER_THAN_POPULATION_SIZE,sampleSize, populationSize, true);
		}
		if(sampleSize > populationSize){
			throw  NumberIsTooLargeException(LocalizedFormats.SAMPLE_SIZE_LARGER_THAN_POPULATION_SIZE, sampleSize, populationSize, true);
		}
		else{
			this.numberOfSuccesses = numberOfSuccesses;
			this.populationSize = populationSize;
			this.sampleSize = sampleSize;
		}
		AbstractIntegerDistribution.call(this, passedRNG);
	}

	//GETTERS AND HELPERS
	HypergeometricDistribution.prototype.getNumberOfSuccesses = function(){
		return this.numberOfSuccesses;
	};
	HypergeometricDistribution.prototype.getPopulationSize= function(){
		return this.populationSize;
	};
	HypergeometricDistribution.prototype.getSampleSize= function(){
		return this.sampleSize;
	};

	HypergeometricDistribution.prototype.getLowerDomain = function(n,m,k){
		return Math.max(0,m-(n-k));
	};
	HypergeometricDistribution.prototype.getUpperDomain= function(m,k){
		return Math.min(k,m);
	};

	HypergeometricDistribution.prototype.getDomain = function(n, m, k){
		var ret1 = this.getLowerDomain(n,m,k);
		var ret2 = this.getUpperDomain(m,k);
		return [ret1, ret2];
	};

	HypergeometricDistribution.prototype.probability = function(x){
		var ret;

		var domain = this.getDomain(this.getPopulationSize(), this.getNumberOfSuccesses(), this.getSampleSize());

		if(x < domain[0] || x > domain[1]){
			ret = 0.0;
		}else{
			var p = this.getSampleSize()/this.getPopulationSize();
			var q = (this.getPopulationSize() - this.getSampleSize())/this.getPopulationSize();
			var p1 = SaddlePointExpansion.logBinomialProbability(x, this.getNumberOfSuccesses(), p, q);
			var p2 = SaddlePointExpansion.logBinomialProbability(this.getSampleSize() - x, this.getPopulationSize() - this.getNumberOfSuccesses(), p, q);
			var p3 = SaddlePointExpansion.logBinomialProbability(this.getSampleSize(), this.getPopulationSize(), p, q);
			ret = Math.exp((p1 + p2 - p3));
		}
		return ret;
	};

	HypergeometricDistribution.prototype.innerCumulativeProbability = function(x0,x1,dx){
		var ret = this.probability(x0);
		while(x0 != x1){
			x0 += dx;
			ret += this.probability(x0);
		}
		return ret;
	};

	HypergeometricDistribution.prototype.cumulativeProbability = function(x){
		var ret;

		var domain = this.getDomain(this.getPopulationSize(), this.getNumberOfSuccesses(), this.getSampleSize());

		if(x < domain[0]){
			ret = 0.0;
		}else if(x >= domain[1]){
			ret = 1.0;
		}else{
			ret = this.innerCumulativeProbability(domain[0], x, 1);
		}

		return ret;

	};
	HypergeometricDistribution.prototype.upperCumulativeProbability = function(x){
		    var ret;

	      var domain = this.getDomain(this.getPopulationSize(), this.getNumberOfSuccesses(), this.getSampleSize());
	      if (x <= domain[0]) {
	          ret = 1.0;
	      } else if (x > domain[1]) {
	          ret = 0.0;
	      } else {
	          ret = this.innerCumulativeProbability(domain[1], x, -1);
	      }
	      return ret;
	};

	HypergeometricDistribution.prototype.getNumericalMean = function(){
		return (this.getSampleSize() * this.getNumberOfSuccesses())/this.getPopulationSize();
	};

	HypergeometricDistribution.prototype.calculateNumericalVariance = function(){
		var N = this.getPopulationSize();
		var m =  this.getNumberOfSuccesses();
		var n = this.getSampleSize();
		return (n * m * (N-n) * (N-m))/(N * N * (N - 1));
	}


	HypergeometricDistribution.prototype.getNumericalVariance = function(){
		if(!HypergeometricDistribution.numericalVarianceIsCalculated){
			HypergeometricDistribution.numericalVariance = this.calculateNumericalVariance();
			HypergeometricDistribution.numericalVarianceIsCalculated = true;
		}
		return HypergeometricDistribution.numericalVariance;
	};


	HypergeometricDistribution.prototype.getSupportLowerBound = function(){
		return Math.max(0, this.getSampleSize() + this.getNumberOfSuccesses() - this.getPopulationSize());
	};


	HypergeometricDistribution.prototype.getSupportUpperBound = function(){
		return Math.min(this.getNumberOfSuccesses(), this.getSampleSize());
	};


	HypergeometricDistribution.prototype.isSupportConnected = function(){
		return true;
	};

module.exports = HypergeometricDistribution;
