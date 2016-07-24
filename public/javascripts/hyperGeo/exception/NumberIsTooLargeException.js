/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalNumberException = require('./MathIllegalNumberException');
NumberIsTooLargeException.protoype = Object.create(MathIllegalNumberException.prototype);
NumberIsTooLargeException.protoype.constructor = NumberIsTooLargeException;

function NumberIsTooLargeException(message, wrong, max, boundIsAllowed){
    MathIllegalNumberException.call(this, message, wrong);
    this.max = max;
}
NumberIsTooLargeException.prototype = {
    getMax: function(){
        return this.max;
    }
};
module.exports = NumberIsTooLargeException;