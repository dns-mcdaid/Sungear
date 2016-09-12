/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends NumberIsTooSmallException

var NumberIsTooSmallException = require('./NumberIsTooSmallException');

NotStrictlyPositiveException.prototype = Object.create(NumberIsTooSmallException.prototype);
NotStrictlyPositiveException.prototype.constructor = NotStrictlyPositiveException;

function NotStrictlyPositiveException(specific, value){
	if(arguments.length == 1){
		NumberIsTooSmallException.call(this, specific, 0, false);
	}else{
		NumberIsTooSmallException.call(this, specific, value, 0, false);
	}
}

module.exports = NotStrictlyPositiveException;
