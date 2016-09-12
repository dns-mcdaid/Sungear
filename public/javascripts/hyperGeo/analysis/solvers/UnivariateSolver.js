/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var BaseUnivariateSolver = require("./BaseUnivariateSolver");
function UnivariateSolver(){}

UnivariateSolver.prototype = Object.create(BaseUnivariateSolver.prototype);
UnivariateSolver.prototype.constructor = UnivariateSolver;

module.exports = UnivariateSolver;