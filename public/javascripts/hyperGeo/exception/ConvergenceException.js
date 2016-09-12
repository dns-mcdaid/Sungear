/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var LocalizedFormats = require("./util/LocalizedFormats");

function ConvergenceException(passedP, args){
    var pattern;
    if(arguments.length == 0){
        pattern = LocalizedFormats.CONVERGENCE_FAILED;
    }

    this.getContext().addMessage(pattern, args);
}

module.exports = ConvergenceException;