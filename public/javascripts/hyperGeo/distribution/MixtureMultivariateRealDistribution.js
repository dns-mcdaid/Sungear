/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractMultivariateDistribution = require("./AbstractMultivariateRealDistribution");

MixtureMultivariateRealDistribution.prototype = Object.create(AbstractMultivariateDistribution.prototype);
MixtureMultivariateRealDistribution.prototype.constructor = MixtureMultivariateRealDistribution;


function MixtureMultivariateRealDistribution(rng, components){
    if(arguments.length == 1){

    }

}