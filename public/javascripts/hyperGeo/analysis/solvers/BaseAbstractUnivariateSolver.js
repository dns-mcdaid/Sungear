/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var UnivariateFunction = require("../UnivariateFunction");
var MaxCountExceededException = require("../../exception/MaxCountExceededException");
var NoBracketingException = require("../../exception/NoBracketingException");
var TooManyEvaluationsException = require("../../exception/TooManyEvaluationsException");
var NumberIsTooLargeException = require("../../exception/NumberIsTooLargeException");
var NullArgumentException = require("../../exception/NullArgumentException");
var MathUtils = require("../../util/MathUtils");
var Incrementor = require("../../util/Incrementor");
var UnivariateSolverUtils = require("./UnivariateSolverUtils");

function BaseAbstractUnivariateSolver(passedRelative, passedAbsolute, passedFunction){

    if(arguments.length == 1){
        this.relativeAccuracy = BaseAbstractUnivariateSolver.DEFAULT_RELATIVE_ACCURACY;
        this.absoluteAccuracy = passedRelative;
        this.functionValueAccuracy = BaseAbstractUnivariateSolver.DEFAULT_FUNCTION_VALUE_ACCURACY;
    }else if(arguments.length == 2){
        this.relativeAccuracy = passedRelative;
        this.absoluteAccuracy = passedAbsolute;
        this.functionValueAccuracy = BaseAbstractUnivariateSolver.DEFAULT_FUNCTION_VALUE_ACCURACY;
    }else{
        this.relativeAccuracy = passedRelative;
        this.absoluteAccuracy = passedAbsolute;
        this.functionValueAccuracy = passedFunction;
    }
    this.evaluations = new Incrementor();
    this.searchMin = -1;
    this.searchMax = -1;
    this.searchStart = -1;
    this.function
}
BaseAbstractUnivariateSolver.prototype = Object.create(UnivariateFunction.prototype);
BaseAbstractUnivariateSolver.prototype.constructor = BaseAbstractUnivariateSolver;

BaseAbstractUnivariateSolver.DEFAULT_RELATIVE_ACCURACY = 1e-14;
BaseAbstractUnivariateSolver.DEFAULT_FUNCTION_VALUE_ACCURACY = 1e-15;

BaseAbstractUnivariateSolver.prototype = {
  getMaxEvaluations: function(){
    return this.evaluation.getMaximalCount();
  },
    getEvaluations: function(){
      return this.evaluations.getCount();
    },
    getMin: function(){
        return this.searchMin;
    },
    getMax: function(){
        return this.searchMax;
    },
    getStartValue: function(){
        return this.searchStart;
    },
    getAbsoluteAccuracy: function(){
        return this.absoluteAccuracy;
    },
    getRelativeAccuracy: function(){
        return this.relativeAccuracy;
    },
    getFunctionValueAccuracy: function(){
        return this.functionValueAccuracy;
    },
    computeObjectiveValue: function(point){
        this.incrementEvaluationCount();
        return this.function.value(point);
    },
    setup: function(maxEval, f, min, max, startValue){
        MathUtils.checkNotNull(f);
        this.searchMin = min;
        this.searchMax = max;
        this.searchStart = startValue;
        this.function = f;
        this.evaluations.setMaximalCount(maxEval);
        this.evaluations.resetCount();
    },
    solve: function(passedMaxEval, passedF, passedMin, passedMax, passedStart){
        if(arguments.length == 3){
            this.setup(passedMaxEval, passedF, Number.NaN, Number.NaN, passedMin);
        }else if(arguments.length == 4){
            this.setup(passedMaxEval, passedF, passedMin, passedMax, passedMin + 0.5 * (passedMax - passedMin));
        }else{
            this.setup(passedMaxEval, passedF, passedMin, passedMax,passedStart)
        }
        return this.doSolve();

    },
    doSolve: function(){

    },
    isBracketing: function(lower, upper){
        return UnivariateSolverUtils.isBracketing(this.function, lower, upper);
    },
    isSequence: function(start, mid, end){
        return UnivariateSolverUtils.isSequence(start, mid, end);
    },
    verifyInterval: function(lower, upper){
        UnivariateSolverUtils.verifyInterval(lower, upper);
    },
    verifyBracketing: function(lower, upper){
        UnivariateSolverUtils.verifyBracketing(this.function, lower, upper);
    },
    incrementEvaluationCount: function(){
        try {
            this.evaluations.incrementCount();
        } catch (e) {
            throw new TooManyEvaluationsException(e.getMax());
        }
    }
};

module.exports = BaseAbstractUnivariateSolver;