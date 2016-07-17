/*
Radhika Mattoo, October 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//extends NumberIsTooSmallException

var serialVersionUID = -7824848630829852237;


//IMPLEMENT INHERITANCE
NotStrictlyPositive.prototype = new NumberIsTooSmallException();

//corect the constructor pointer, because it points to AbstractIntegerDistribution right now
NotStrictlyPositive.prototype.constructor = NotStrictlyPositive;

//create a parent property for NotStrictlyPositive to call superClass methods,
//rather than having to use NumberIsTooSmallException.prototype.functionName.call() everytime
NotStrictlyPositive.prototype.parent = NumberIsTooSmallException.prototype;

function NotStrictlyPositiveException(value){
	this.parent.NumberIsTooSmallException.call(this, value, 0, false);
}

// //exception with a specific context
// function NotStrictlyPositiveException(specific, value){
// 	this.parent.NumberIsTooSmallException.call(this, specific, value, 0, false);
// }
