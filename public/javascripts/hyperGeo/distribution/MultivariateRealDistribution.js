/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

/*
Base Interface for multivariate distribution on the reals

*/

function MultivariateRealDistribution(){}
MultivariateRealDistribution.prototype.density = function (x){};
MultivariateRealDistribution.prototype.reseedRandomGenerator = function (seed){};
MultivariateRealDistribution.prototype.getDimension = function (){};
MultivariateRealDistribution.prototype.sample = function (sampleSize){};
