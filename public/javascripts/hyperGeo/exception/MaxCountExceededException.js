/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathIllegalStateException = require("./MathIllegalStateException");
function MaxCountExceededException(specific, max, args){
    if(arguments.length ==1){
        this.getContext().addMessage(LocalizedFormats.MAX_COUNT_EXCEEDED, max);
        this.max = specific;
    }else{
        this.getContext().addMessage(specific, max, args);
        this.max = max;
    }
}

MaxCountExceededException.prototype = {
  getMax: function(){
      return this.max;
  }
};

MaxCountExceededException.prototype = Object.create(MathIllegalStateException.prototype);
MaxCountExceededException.prototype.constructor = MaxCountExceededException;

module.exports = MaxCountExceededException;