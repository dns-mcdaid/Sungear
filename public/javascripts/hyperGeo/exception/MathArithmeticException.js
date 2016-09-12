/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var LocalizedFormats = require("./util/LocalizedFormats");
var Localizable = require("./util/Localizable");
var ExceptionContext = require("./util/ExceptionContext");

function MathArithmeticException(pattern, args){
    if(arguments.length == 0){
        this.context = new ExceptionContext(this);
        this.context.addMessage(LocalizedFormats.ARITHMETIC_EXCEPTION);
    }else{
        this.context = new ExceptionContext(this);
        this.context.addMessage(pattern, args);
    }
}

MathArithmeticException.prototype = {
    getContext: function(){
        return this.context;
    },
    getMessage: function(){
        return this.context.getMessage();
    }
};

module.exports = MathArithmeticException;