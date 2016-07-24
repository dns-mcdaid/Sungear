/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends NumberIsTooSmallException

var serialVersionUID = -7824848630829852237;
var NumberIsTooSmallException = require('./NumberIsTooSmallException');

NotStrictlyPositiveException.prototype = Object.create(NumberIsTooSmallException.prototype);
NotStrictlyPositiveException.prototype.constructor = NotStrictlyPositiveException;

function NotStrictlyPositiveException(value){
	NumberIsTooSmallException.call(this, "NotStrictlyPositiveException", value);
}

module.exports = NotStrictlyPositiveException;
