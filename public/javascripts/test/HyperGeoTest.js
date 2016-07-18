/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Test JS function, adapted from Ilyas' Java code

*/
// define(['HypergeometricDistribution'], function(HypergeometricDistribution){
//
// 	document.getElementById('submission').onclick = function(){
// 		var population = Number(document.getElementById("populationSize").value);
// 		var successNumber = Number(document.getElementById("successNumber").value);
// 		var sampleSize = Number(document.getElementById("sampleSize").value);
// 		var successPerSample = Number(document.getElementById("successPerSample").value);
//
//
// 		var h = new HypergeometricDistribution.HypergeometricDistribution(population, successNumber, sampleSize);
//
// 		 var outputString = "";
// 	 	outputString += "The mean is = " + h.getNumericalMean() + "\n";
// 		console.log(h.getNumericalMean());
// 	 	outputString += "The cumulative Probability P(X = " + successPerSample + ") = " + h.probability(successPerSample) + "\n";
// 	  	outputString += "The cumulative Probability P(X <= " + successPerSample + ") = " + h.cumulativeProbability(successPerSample) + "\n";
// 	 	outputString += "The cumulative Probability P(X >= " + successPerSample + ") = " + h.upperCumulativeProbability(successPerSample) + "\n";
//
// 		document.getElementById("output").innerHTML = outputString;
// 	};
// });
