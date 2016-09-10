/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var NumberIsTooSmallException = require("../exception/NumberIsTooSmallException");
var OutOfRangeException = require("../exception/OutOfRangeException");
var ContinuedFraction = require("../util/ContinuedFraction");
var Gamma = require("./Gamma");
var FastMath = require("../util/FastMath");

function Beta(){}
Beta.DEFAULT_EPSILON = 1E-14;
Beta.HALF_LOG_TWO_PI = .9189385332046727;

Beta.DELTA = [
        .833333333333333333333333333333E-01,
    -.277777777777777777777777752282E-04,
    .793650793650793650791732130419E-07,
    -.595238095238095232389839236182E-09,
    .841750841750832853294451671990E-11,
    -.191752691751854612334149171243E-12,
    .641025640510325475730918472625E-14,
    -.295506514125338232839867823991E-15,
    .179643716359402238723287696452E-16,
    -.139228964661627791231203060395E-17,
    .133802855014020915603275339093E-18,
    -.154246009867966094273710216533E-19,
    .197701992980957427278370133333E-20,
    -.234065664793997056856992426667E-21,
    .171348014966398575409015466667E-22
];

Beta.regularizedBeta = function(passedX, passedA, passedB, passedEpsilon, passedIterations){
    var x = passedX;
    var a = passedA;
    var b = passedB;
    var maxIterations;
    var epsilon;
    if(arguments.length == 3){
        epsilon = Beta.DEFAULT_EPSILON;
        maxIterations = Number.MAX_VALUE;
    }else if(arguments.length == 4){
        if(passedIterations % 1 !== 0){ //decimal
            epsilon = passedEpsilon;
            maxIterations = Number.MAX_VALUE;
        }else{
            maxIterations = passedEpsilon;
            epsilon = Beta.DEFAULT_EPSILON;
        }
    }else{
        epsilon = passedEpsilon;
        maxIterations = passedIterations;
    }

    var ret;
    if(isNaN(x) || isNaN(a) || isNaN(b) || x < 0 || x > 1 || a <= 0.0 || b <= 0.0){
        ret = Number.NaN;
    }else if(x > (a + 1.0) / (a + b + 2.0)){
        ret = 1.0 - this.regularizedBeta(1.0 - x, b, a, epsilon, maxIterations);
    }else{
        var fraction = ContinuedFraction;
        fraction. getB = function(n, x){
                var ret;
                var m;
                if(n % 2 == 0){
                    m = n/2.0;
                    ret = (m * (b - m) * x) /
                        ((a + (2 * m) - 1) * (a + (2 * m)));
                }else{
                    m = (n - 1.0)/2.0;
                    ret = -((a + m) * (a + b + m) * x) /
                        ((a + (2 * m)) * (a + (2 * m) + 1.0));
                }
                return ret;
        };
        fraction.getA = function(n, x){
                return 1.0;
        };

        ret = Math.exp((a * Math.log(x)) + (b * Math.log(1.0 - x)) -
            Math.log(a) - this.logBeta(a, b)) *
        1.0 / fraction.evaluate(x, epsilon, maxIterations);
    }
    return ret;
};

Beta.logBeta = function(p, q, epsilon, maxIterations){
    if (isNaN(p) || isNaN(q) || (p <= 0.0) || (q <= 0.0)) {
        return Number.NaN;
    }
    var a = Math.min(p, q);
    var b = Math.max(p, q);

    if( a >= 10.0){
        var w = Beta.sumDeltaMinusDeltaSum(a, b);
        var h = a / b;
        var c = h / (1.0 + h);
        var u = -(a - 0.5) * Math.log(c);
        var v = b * FastMath.log1p(h);
        if (u <= v) {
            return (((-0.5 * Math.log(b) + Beta.HALF_LOG_TWO_PI) + w) - u) - v;
        } else {
            return (((-0.5 * Math.log(b) + Beta.HALF_LOG_TWO_PI) + w) - v) - u;
        }
    }else if (a > 2.0) {
        if (b > 1000.0) {
            var n = Math.floor(a - 1.0);
            var prod = 1.0;
            var ared = a;
            for (var i = 0; i < n; i++) {
                ared -= 1.0;
                prod *= ared / (1.0 + ared / b);
            }
            return (Math.log(prod) - n * Math.log(b)) +
                (Gamma.logGamma(ared) +
                Beta.logGammaMinusLogGammaSum(ared, b));
        } else {
            var prod1 = 1.0;
            var ared = a;
            while (ared > 2.0) {
                ared -= 1.0;
                var h = ared / b;
                prod1 *= h / (1.0 + h);
            }
            if (b < 10.0) {
                var prod2 = 1.0;
                var bred = b;
                while (bred > 2.0) {
                    bred -= 1.0;
                    prod2 *= bred / (ared + bred);
                }
                return Math.log(prod1) +
                    Math.log(prod2) +
                    (Gamma.logGamma(ared) +
                    (Gamma.logGamma(bred) -
                    Beta.logGammaSum(ared, bred)));
            } else {
                return Math.log(prod1) +
                    Gamma.logGamma(ared) +
                    Beta.logGammaMinusLogGammaSum(ared, b);
            }
        }
    } else if (a >= 1.0) {
        if (b > 2.0) {
            if (b < 10.0) {
                var prod = 1.0;
                var bred = b;
                while (bred > 2.0) {
                    bred -= 1.0;
                    prod *= bred / (a + bred);
                }
                return Math.log(prod) +
                    (Gamma.logGamma(a) +
                    (Gamma.logGamma(bred) -
                    Beta.logGammaSum(a, bred)));
            } else {
                return Gamma.logGamma(a) +
                    Beta.logGammaMinusLogGammaSum(a, b);
            }
        } else {
            return Gamma.logGamma(a) +
                Gamma.logGamma(b) -
                Beta.logGammaSum(a, b);
        }
    } else {
        if (b >= 10.0) {
            return Gamma.logGamma(a) +
                Beta.logGammaMinusLogGammaSum(a, b);
        } else {
            // The following command is the original NSWC implementation.
            // return Gamma.logGamma(a) +
            // (Gamma.logGamma(b) - Gamma.logGamma(a + b));
            // The following command turns out to be more accurate.
            return Math.log(Gamma.gamma(a) * Gamma.gamma(b) /
                Gamma.gamma(a + b));
        }
    }//END
};

Beta.logGammaSum = function(a, b){
  if((a < 1.0) || (a > 2.0)){
      throw new OutOfRangeException(a, 1.0, 2.0);
  }
  if((b < 1.0) || (b > 2.0)){
      throw new OutOfRangeException(b, 1.0, 2.0);
  }

  var x = (a - 1.0) + (b - 1.0);
    if(x <= 0.5){
        return Gamma.logGamma(1.0 + x);
    }else if (x <= 1.5){
        return Gamma.logGamma1p(x) + FastMath.log1p(x);
    }else{
        return Gamma.logGamma1p(x - 1.0) + Math.log(x * (1.0 + x));
    }
};

Beta.logGammaMinusLogGammaSum = function(a, b){
    if( a < 0.0){
        throw new NumberIsTooSmallException(a, 0.0, true);
    }
    if (b < 10.0) {
        throw new NumberIsTooSmallException(b, 10.0, true);
    }
    var d;
    var w;
    if (a <= b) {
        d = b + (a - 0.5);
        w = Beta.deltaMinusDeltaSum(a, b);
    } else {
        d = a + (b - 0.5);
        w = Beta.deltaMinusDeltaSum(b, a);
    }

    var u = d * FastMath.log1p(a/b);
    var v = a * (Math.log(b) - 1.0);

    return u <= v ? (w - u) - v : (w - v) - u;

};

Beta.deltaMinusDeltaSum = function(a, b){
    if ((a < 0) || (a > b)) {
        throw new OutOfRangeException(a, 0, b);
    }
    if (b < 10) {
        throw new NumberIsTooSmallException(b, 10, true);
    }

    var h = a/b;
    var p = h/ (1.0 + h);
    var q = 1.0/(1.0 + h);
    var q2 = q * q;

    var s = [];
    s[0] = 1.0;
    for (var i = 1; i < s.length; i++) {
        s[i] = 1.0 + (q + q2 * s[i - 1]);
    }

    var sqrtT = 10.0 / b;
    var t = sqrtT * sqrtT;
    var w = Beta.DELTA[Beta.DELTA.length - 1] * s[s.length - 1];

    for (var i = Beta.DELTA.length - 2; i >= 0; i--) {
        w = t * w + Beta.DELTA[i] * s[i];
    }
    return w * p / b;
};

Beta.sumDeltaMinusDeltaSum = function(p, q){
    if (p < 10.0) {
        throw new NumberIsTooSmallException(p, 10.0, true);
    }
    if (q < 10.0) {
        throw new NumberIsTooSmallException(q, 10.0, true);
    }

    var a = Math.min(p, q);
    var b = Math.max(p, q);
    var sqrtT = 10.0/a;
    var t = sqrtT * sqrtT;
    var z = Beta.DELTA[Beta.DELTA.length - 1];
    for (var i = Beta.DELTA.length - 2; i >= 0; i--) {
        z = t * z + Beta.DELTA[i];
    }
    return z / a + Beta.deltaMinusDeltaSum(a, b);
};


module.exports = Beta;