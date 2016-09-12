/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//Exception to be thrown when an argument is negative

//extends NumberIsTooSmallException


var NumberIsTooSmallException = require("./NumberIsTooSmallException");
//create inheritance via .prototype
NotPositiveException.prototype = Object.create(NumberIsTooSmallException.prototype);
NotPositiveException.prototype.constructor = NotPositiveException;

//constructor
function NotPositiveException(specific, value){
	if(arguments.length == 1){
		NumberIsTooSmallException.call(this, specific, 0, true);
	}else{
		NumberIsTooSmallException.call(this, specific, value, 0, true);
	}
}

module.exports = NotPositiveException;