/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var UnivariateFunction = require("../UnivariateFunction");
var MathInternalError = require("../../exception/MathInternalError");
var ConvergenceException = require("../../exception/ConvergenceException");
var AbstractUnivariateSolver = require("./AbstractUnivariateSolver");

BaseSecantSolver.DEFAULT_ABSOLUTE_ACCURACY = 1e-6;

function BaseSecantSolver(){}