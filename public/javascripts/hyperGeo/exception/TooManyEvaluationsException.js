/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MaxCountExceededException = require("./MaxCountExceededException");
var LocalizedFormats = require("./util/LocalizedFormats");

function TooManyEvaluationsException(max){
    MaxCountExceededException.call(this, max);
    this.getContext().addMessage(LocalizedFormats.EVALUATIONS);
}

TooManyEvaluationsException.prototype = Object.create(MaxCountExceededException.prototype);
TooManyEvaluationsException.prototype.constructor = TooManyEvaluationsException;

module.exports = TooManyEvaluationsException;