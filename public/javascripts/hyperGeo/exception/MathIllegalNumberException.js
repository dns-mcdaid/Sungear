/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends MathIllegalArgumentException

var MathIllegalArgumentException = require('./MathIllegalArgumentException');

function MathIllegalNumberException(pattern, wrong, args){ //Object...arguments (variable # of arguments in JS gets stored in the arguments variable)
	MathIllegalArgumentException.call(this, pattern, wrong, args);
	this.argument = wrong;
}


//IMPLEMENT INHERITANCE
MathIllegalNumberException.protoype = Object.create(MathIllegalArgumentException.prototype);
MathIllegalNumberException.protoype.constructor =  MathIllegalNumberException;

MathIllegalNumberException.prototype = {
	getArgument: function(){
		return this.argument;
	}
};

module.exports = MathIllegalNumberException;
