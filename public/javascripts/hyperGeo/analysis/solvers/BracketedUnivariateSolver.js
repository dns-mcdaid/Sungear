/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var BaseUnivariateSolver = require("./BaseUnivariateSolver");
function BracketedUnivariateSolver(){}

BracketedUnivariateSolver.prototype = Object.create(BaseUnivariateSolver);
BracketedUnivariateSolver.prototype.constructor =  BracketedUnivariateSolver;

BracketedUnivariateSolver.prototype = {
    solve: function(){}
};

module.exports = BracketedUnivariateSolver;