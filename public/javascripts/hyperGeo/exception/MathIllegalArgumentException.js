/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends JAVA'S IllegalArgumentException --> not sure how to implement the inheritance

//uses:
// hyperGeo.exception.util.ExceptionContext;
// hyperGeo.exception.util.ExceptionContextProvider;


function MathIllegalArgumentException(message, errorObject){
	this.message = new Error(message);
	this.errorObject = errorObject;
}
MathIllegalArgumentException.prototype = {
	getMessage: function(){
		return this.context;
	}
};


module.exports = MathIllegalArgumentException;