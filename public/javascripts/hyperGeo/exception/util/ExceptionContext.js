/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

NO SERIALIZATION
*/
require("javascript.util");
var HashMap = javascript.util.HashMap;
var List = javascript.util.List;
var ArgUtils = require("./ArgUtils");

function ExceptionContext(throwable){
    this.throwable = throwable;
    this.msgPatterns = new List();
    this.msgArguments = new List();
    this.context = new HashMap();
}

ExceptionContext.prototype = {
    getThrowable: function(){
        return this.throwable;
    },
    addMessage: function(pattern, arguments){
        this.msgPatterns.add(pattern);
        this.msgArguments.add(ArgUtils.flatten(arguments));
    },
    setValue: function(key, value){
        this.context.put(key, value);
    },
    getValue: function(key){
        return this.context.get(key);
    },
    getKeys: function(){
        return this.context.keySet();
    },
    getMessage: function(passedLocale){
        var locale;
        if(arguments.length == 0){
            locale = "US";
        }else{
            locale = passedLocale;
        }

        return buildMessage(locale, ": ");
    },
    buildMessage: function(locale, separator){
        var sb = "";
        var count = 0;
        var len = this.msgPatterns.length;
        for(var i = 0; i < len; i++){
            var pat = this.msgPatterns.get(i);
            var args = this.msgArguments.get(i);

            sb += args;
            if(++count < len){
                sb += separator;
            }
        }
    }
};

module.exports = ExceptionContext;