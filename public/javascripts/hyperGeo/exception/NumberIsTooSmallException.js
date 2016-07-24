/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require("./MathIllegalNumberException");
var LocalizedFormats = require("./util/LocalizedFormats");

NumberIsTooSmallException.prototype = Object.create(MathIllegalNumberException.prototype);
NumberIsTooSmallException.prototype.constructor = NumberIsTooSmallException;

function NumberIsTooSmallException(specific, wrong, min, boundIsAllowed){
	var format;
	var passedWrong;
	if(arguments.length == 3){
		format = boundIsAllowed ? LocalizedFormats.NUMBER_TOO_SMALL : LocalizedFormats.NUMBER_TOO_SMALL_BOUND_EXCLUDED;
		this.min = wrong;
		this.boundIsAllowed = min;
		passedWrong = specific;
	}else{
		format = specific;
		passedWrong = wrong;
		this.min = min;
		this.boundIsAllowed = boundIsAllowed;
	}

	MathIllegalNumberException.call(this, format, this);
}

NumberIsTooSmallException.prototype = {
	constructor: NumberIsTooSmallException,
	getBoundIsAllowed : function(){
		return this.boundIsAllowed;
	},
	getMin: function(){
		return this.min;
	}
};
module.exports = NumberIsTooSmallException;