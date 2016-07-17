/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//also implements UnivariateSolver methods
var BaseAbstractUnivariateSolver = require("./BaseAbstractUnivariateSolver");
AbstractUnivariateSolver.prototype = Object.create(BaseAbstractUnivariateSolver.prototype);
AbstractUnivariateSolver.prototype.constructor = AbstractUnivariateSolver;


function AbstractUnivariateSolver(relativeAccuracy, absoluteAccuracy, functionValueAccuracy){
  if(arguments.length == 1){
    BaseAbstractUnivariateSolver.call(this, relativeAccuracy);
  }else if(arguments.length == 2){
    BaseAbstractUnivariateSolver.call(this, relativeAccuracy, absoluteAccuracy);
  }else{
    BaseAbstractUnivariateSolver.call(this, relativeAccuracy, absoluteAccuracy, functionValueAccuracy);
  }
}

module.exports = AbstractUnivariateSolver;
