/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var DEFAULT_RELATIVE_ACCURACY = 1e-14;
var DEFAULT_FUNCTION_VALUE_ACCURACY = 1e-15;
var Incrementor = require("../../util/Incrementor");

//implements BaseUnivariateSolver


function BaseUnivariateSolver(relativeAccuracy, absoluteAccuracy, functionValueAccuracy){
  this.evaluations = new Incrementor();

  if(arguments.length == 1){
    this.relativeAccuracy = DEFAULT_RELATIVE_ACCURACY;
    this.absoluteAccuracy = absoluteAccuracy;
    this.functionValueAccuracy = DEFAULT_FUNCTION_VALUE_ACCURACY;
  }else if(arguments.length == 2){
    this.relativeAccuracy = relativeAccuracy;
    this.absoluteAccuracy = absoluteAccuracy;
    this.functionValueAccuracy = DEFAULT_FUNCTION_VALUE_ACCURACY;
  }else{
    this.relativeAccuracy = relativeAccuracy;
    this.absoluteAccuracy = absoluteAccuracy;
    this.functionValueAccuracy = functionValueAccuracy;
  }
}

BaseUnivariateSolver.prototype = {
    getMaxEvaluations: function(){
        return this.evaluations.getMaximalCount();
    },
    getEvaluations: function(){
        return this.evaluation.getCount();
    },
    getMin: function(){
        return this.searchMin;
    }
};

module.exports = BaseUnivariateSolver;
