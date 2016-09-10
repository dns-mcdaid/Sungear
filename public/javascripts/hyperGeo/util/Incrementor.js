/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MaxCountExceededCallback = require("./MaxCountExceededCallback");
var MaxCountExceededException = require("../exception/MaxCountExceededException");

function Incrementor(passedMax){
    this.count = 0;

    var max;
    if(arguments.length == 0){
        max = 0;
    }else{
        max = passedMax;
    }

    this.maxCountCallback = new MaxCountExceededCallback();
    this.maxCountCallback.trigger = function(max){
        throw new MaxCountExceededException(max);
    };

    this.maximalCount = max;

}

Incrementor.prototype = {
    setMaximalCount: function(max){
        this.maximalCount = max;
    },
    getMaximalCount : function(){
        return this.maximalCount;
    },
    getCount: function(){
        return this.count;
    },
    canIncrement: function(){
        return count < maximalCount;
    },
    incrementCount: function(value){
        if(arguments.length == 1) {
            for (var i = 0; i < value; i++) {
                this.incrementCount();
            }
        }else{
            if (++this.count > this.maximalCount) {
                this.maxCountCallback.trigger(this.maximalCount);
            }
        }
    },
    resetCount: function(){
        this.count = 0;
    }
};

module.exports = Incrementor;