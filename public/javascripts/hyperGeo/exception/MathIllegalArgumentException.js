/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends JAVA'S IllegalArgumentException --> not sure how to implement the inheritance

//uses:
// hyperGeo.exception.util.ExceptionContext;
// hyperGeo.exception.util.ExceptionContextProvider;

var serialVersionUID = -6024911025449780478;

var context;

function MathIllegalArgumentException(pattern, args){
	context = new ExceptionContext(this);
	//context.addMessage(pattern, args); UNCOMMENT WHEN EXCEPTIONCONTEXT IS IMPLEMENTED
}
function getContext(){
	return context;
}

function getMessage(){
	//return context.getMessage(); SEE CONSTRUCTOR COMMENT
}
function getLocalizedMessage(){
	//return context.getLocalizedMessage(); SEE CONSTRUCTOR COMMENT
}

module.exports = MathIllegalArgumentException;