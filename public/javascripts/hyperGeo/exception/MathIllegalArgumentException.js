/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends JAVA'S IllegalArgumentException --> not sure how to implement the inheritance

//uses:
// hyperGeo.exception.util.ExceptionContext;
// hyperGeo.exception.util.ExceptionContextProvider;
var ExceptionContext = require("./util/ExceptionContext");

function MathIllegalArgumentException(message, args){
	this.context = new ExceptionContext(this);
	this.context.addMessage(pattern, args)
}
MathIllegalArgumentException.prototype = {
	getMessage: function(){
		return this.context.getMessage();
	},
	getContext: function(){
		return this.context;
	}
};


module.exports = MathIllegalArgumentException;