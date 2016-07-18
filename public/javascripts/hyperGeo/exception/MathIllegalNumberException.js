/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends MathIllegalArgumentException

var serialVersionUID = -7447085893598031110;

var argument;

//IMPLEMENT INHERITANCE
MathIllegalNumberException.prototype = new MathIllegalArgumentException();

//corect the constructor pointer, because it points to AbstractIntegerDistribution right now
MathIllegalNumberException.prototype.constructor = MathIllegalNumberException;

//create a parent property for MathIllegalNumberException to call superClass methods,
//rather than having to use MathIllegalNumberException.prototype.functionName.call() everytime
MathIllegalNumberException.prototype.parent = MathIllegalNumberException.prototype;

function MathIllegalNumberException(pattern, wrong){ //Object...arguments (variable # of arguments in JS gets stored in the arguments variable)
	this.parent.MathIllegalNumberException.call(pattern, wrong, arguments);
	argument = wrong;

}

function getArgument(){
	return argument;
}

module.exports = MathIllegalNumberException;
