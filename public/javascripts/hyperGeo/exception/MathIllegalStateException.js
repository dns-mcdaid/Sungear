/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var ExceptionContext = require("./util/ExceptionContext");
var LocalizedFormats = require("./util/LocalizedFormats");

function MathIllegalStateException(cause, pattern, args){
    this.context = new ExceptionContext(this);

    if(arguments.length == 0){
        this.context.addMessage(LocalizedFormats.ILLEGAL_STATE, []);
    }else if(arguments.length == 1 || arguments.length == 2){
        this.context.addMessage(cause, pattern);
    }else{
        this.context.addMessage(pattern, args);
    }
}

MathIllegalStateException.prototype = {
    getContext: function(){
        return this.context;
    },
    getMessage: function(){
        return this.context.getMessage();
    }
};

module.exports = MathIllegalStateException;