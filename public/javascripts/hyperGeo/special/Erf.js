/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var Gamma = require("./Gamma");

function Erf(){}

Erf.X_CRIT =  0.4769362762044697;

Erf.erf = function(x1, x2){
    if(arguments.length == 1){
        if (Math.abs(x1) > 40) {
            return x > 0 ? 1 : -1;
        }
        var ret = Gamma.regularizedGammaP(0.5, x * x, 1.0e-15, 10000);
        return x < 0 ? -ret : ret;
    }else{
        if(x1 > x2) {
            return -Erf.erf(x2, x1);
        }

        return x1 < -Erf.X_CRIT ?
            x2 < 0.0 ?
            Erf.erfc(-x2) - Erf.erfc(-x1) :
            Erf.erf(x2) - Erf.erf(x1) :
            x2 > Erf.X_CRIT && x1 > 0.0 ?
            Erf.erfc(x1) - Erf.erfc(x2) :
            Erf.erf(x2) - Erf.erf(x1);
        }
};

Erf.erfc = function(x){
    if (Math.abs(x) > 40) {
        return x > 0 ? 0 : 2;
    }
    var ret = Gamma.regularizedGammaQ(0.5, x * x, 1.0e-15, 10000);
    return x < 0 ? 2 - ret : ret;
};

module.exports = Erf;