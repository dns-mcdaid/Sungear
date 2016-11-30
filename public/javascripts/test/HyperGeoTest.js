/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Test JS function, adapted from Ilyas' Java code

*/
var HypergeometricDistribution = require('../hyperGeo/distribution/HypergeometricDistribution');
module.exports = {
   test: function(){
       var population = 120;
       var successNumber = 20;
       var sampleSize = 12;
       var successPerSample = 4;
       var h = new HypergeometricDistribution(population, successNumber, sampleSize);
       var outputString = "";
       outputString += "The mean is = " + h.getNumericalMean() + "\n";
       outputString += "The cumulative Probability P(X = " + successPerSample + ") = " + h.probability(successPerSample) + "\n";
       outputString += "The cumulative Probability P(X <= " + successPerSample + ") = " + h.cumulativeProbability(successPerSample) + "\n";
       outputString += "The cumulative Probability P(X >= " + successPerSample + ") = " + h.upperCumulativeProbability(successPerSample) + "\n";
       console.log(outputString);
   }

};
