/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var MathArithmeticException = require("../exception/MathArithmeticException");
var NotPositiveException = require("../exception/NotPositiveException");
var NumberIsTooLargeException = require("../exception/NumberIsTooLargeException");
var LocalizedFormats = require("../exception/util/LocalizedFormats");


var FACTORIALS = {
    1,                  1,                   2,
    6,                 24,                 120,
    720,               5040,               40320,
    362880,            3628800,            39916800,
    479001600,         6227020800,         87178291200,
    1307674368000,     20922789888000,     355687428096000,
    6402373705728000, 121645100408832000, 2432902008176640000 };
var STIRLING_S2 = null;

function ArithmeticUtils(){}

//STATIC FUNCTIONS

ArithmeticUtils.addAndCheck =  function(x, y){
    var s = x + y;
    if (s < Number.MIN_VALUE || s > Number.MAX_VALUE) {
        throw new MathArithmeticException(LocalizedFormats.OVERFLOW_IN_ADDITION, x, y);
    }
    return s;
};

ArithmeticUtils.binomialCoefficient = function(n,k){
    ArithmeticUtils.checkBinomial(n, k);
    if ((n == k) || (k == 0)) {
        return 1;
    }
    if ((k == 1) || (k == n - 1)) {
        return n;
    }
    // Use symmetry for large k
    if (k > n / 2) {
        return ArithmeticUtils.binomialCoefficient(n, n - k);
    }

    // We use the formula
    // (n choose k) = n! / (n-k)! / k!
    // (n choose k) == ((n-k+1)*...*n) / (1*...*k)
    // which could be written
    // (n choose k) == (n-1 choose k-1) * n / k
    var result = 1;
    if (n <= 61) {
        // For n <= 61, the naive implementation cannot overflow.
        var i = n - k + 1;
        for(var j = 1; j <= k; j++) {
            result = result * i / j;
            i++;
        }
    } else if (n <= 66) {
        // For n > 61 but n <= 66, the result cannot overflow,
        // but we must take care not to overflow intermediate values.
        var i = n - k + 1;
        for (var j = 1; j <= k; j++) {
            // We know that (result * i) is divisible by j,
            // but (result * i) may overflow, so we split j:
            // Filter out the gcd, d, so j/d and i/d are integer.
            // result is divisible by (j/d) because (j/d)
            // is relative prime to (i/d) and is a divisor of
            // result * (i/d).
            var d = ArithmeticUtils.gcd(i, j);
            result = (result / (j / d)) * (i / d);
            i++;
        }
    } else {
        // For n > 66, a result overflow might occur, so we check
        // the multiplication, taking care to not overflow
        // unnecessary.
        var i = n - k + 1;
        for (var j = 1; j <= k; j++) {
            var d = ArithmeticUtils.gcd(i, j);
            result = ArithmeticUtils.mulAndCheck(result / (j / d), i / d);
            i++;
        }
    }
    return result;
};

ArithmeticUtils.binomialCoefficientDouble = function(n,k){
    ArithmeticUtils.checkBinomial(n, k);
    if ((n == k) || (k == 0)) {
        return 1;
    }
    if ((k == 1) || (k == n - 1)) {
        return n;
    }
    if (k > n/2) {
        return ArithmeticUtils.binomialCoefficientDouble(n, n - k);
    }
    if (n < 67) {
        return ArithmeticUtils.binomialCoefficient(n,k);
    }

    var result = 1;
    for (var i = 1; i <= k; i++) {
        result *= (n - k + i) / i;
    }

    return Math.floor(result + 0.5);
};

ArithmeticUtils.checkBinomial = function(n, k){
    if (n < k) {
        throw new NumberIsTooLargeException(LocalizedFormats.BINOMIAL_INVALID_PARAMETERS_ORDER,
            k, n, true);
    }
    if (n < 0) {
        throw new NotPositiveException(LocalizedFormats.BINOMIAL_NEGATIVE_PARAMETER, n);
    }
};




ArithmeticUtils.binomialCoefficientLog = function(n,k){
    ArithmeticUtils.checkBinomial(n, k);
    if ((n == k) || (k == 0)) {
        return 0;
    }
    if ((k == 1) || (k == n - 1)) {
        return Math.log(n);
    }

    /*
     * For values small enough to do exact integer computation,
     * return the log of the exact value
     */
    if (n < 67) {
        return Math.log(ArithmeticUtils.binomialCoefficient(n,k));
    }

    /*
     * Return the log of binomialCoefficientDouble for values that will not
     * overflow binomialCoefficientDouble
     */
    if (n < 1030) {
        return Math.log(ArithmeticUtils.binomialCoefficientDouble(n, k));
    }

    if (k > n / 2) {
        return ArithmeticUtils.binomialCoefficientLog(n, n - k);
    }

    /*
     * Sum logs for values that could overflow
     */
    var logSum = 0;

    // n!/(n-k)!
    for (var i = n - k + 1; i <= n; i++) {
        logSum += Math.log(i);
    }

    // divide by k!
    for (var i = 2; i <= k; i++) {
        logSum -= Math.log(i);
    }

    return logSum;
};


ArithmeticUtils.factorial = function(n){
    if (n < 0) {
        throw new NotPositiveException(LocalizedFormats.FACTORIAL_NEGATIVE_PARAMETER,
            n);
    }
    if (n > 20) {
        throw new MathArithmeticException();
    }
    return FACTORIALS[n];
};

ArithmeticUtils.factorialDouble = function(n){
    if (n < 0) {
        throw new NotPositiveException(LocalizedFormats.FACTORIAL_NEGATIVE_PARAMETER,
            n);
    }
    if (n < 21) {
        return FACTORIALS[n];
    }
    return Math.floor(Math.exp(ArithmeticUtils.factorialLog(n)) + 0.5);
};

ArithmeticUtils.factorialLog = function(n){
    if (n < 0) {
        throw new NotPositiveException(LocalizedFormats.FACTORIAL_NEGATIVE_PARAMETER,
            n);
    }
    if (n < 21) {
        return Math.log(FACTORIALS[n]);
    }
    var logSum = 0;
    for (var i = 2; i <= n; i++) {
        logSum += Math.log(i);
    }
    return logSum;
};

ArithmeticUtils.gcd = function(p,q){
    var a = p;
    var b = q;
    if (a == 0 ||
        b == 0) {
        if (a == Number.MIN_VALUE ||
            b == Number.MIN_VALUE) {
            throw new MathArithmeticException(LocalizedFormats.GCD_OVERFLOW_32_BITS,
                p, q);
        }
        return Math.abs(a + b);
    }

    var al = a;
    var bl = b;
    var useLong = false;
    if (a < 0) {
        if(Number.MIN_VALUE == a) {
            useLong = true;
        } else {
            a = -a;
        }
        al = -al;
    }
    if (b < 0) {
        if (Number.MIN_VALUE == b) {
            useLong = true;
        } else {
            b = -b;
        }
        bl = -bl;
    }
    if (useLong) {
        if(al == bl) {
            throw new MathArithmeticException(LocalizedFormats.GCD_OVERFLOW_32_BITS,
                p, q);
        }
        var blbu = bl;
        bl = al;
        al = blbu % al;
        if (al == 0) {
            if (bl > Number.MAX_VALUE) {
                throw new MathArithmeticException(LocalizedFormats.GCD_OVERFLOW_32_BITS,
                    p, q);
            }
            return  bl;
        }
        blbu = bl;

        // Now "al" and "bl" fit in an "int".
        b =  al;
        a =  (blbu % al);
    }

    return ArithmeticUtils.gcdPositive(a, b);
};

ArithmeticUtils.gcdPositive = function(a, b){
    if (a == 0) {
        return b;
    }
    else if (b == 0) {
        return a;
    }

    // Make "a" and "b" odd, keeping track of common power of 2.
    var aTwos = numberOfTrailingZeros(a);
    a >>= aTwos;
    var bTwos = numberOfTrailingZeros(b);
    b >>= bTwos;
    var shift = Math.min(aTwos, bTwos);

    // "a" and "b" are positive.
    // If a > b then "gdc(a, b)" is equal to "gcd(a - b, b)".
    // If a < b then "gcd(a, b)" is equal to "gcd(b - a, a)".
    // Hence, in the successive iterations:
    //  "a" becomes the absolute difference of the current values,
    //  "b" becomes the minimum of the current values.
    while (a != b) {
        var delta = a - b;
        b = Math.min(a, b);
        a = Math.abs(delta);

        // Remove any power of 2 in "a" ("b" is guaranteed to be odd).
        a >>= numberOfTrailingZeros(a);
    }

    // Recover the common power of 2.
    return a << shift;
};

ArithmeticUtils.lcm = function(a,b){
    if (a == 0 || b == 0){
        return 0;
    }
    var lcm = Math.abs(ArithmeticUtils.mulAndCheck(a / gcd(a, b), b));
    if (lcm == Number.MIN_VALUE) {
        throw new MathArithmeticException(LocalizedFormats.LCM_OVERFLOW_32_BITS,
            a, b);
    }
    return lcm;
};

ArithmeticUtils.mulAndCheck = function(x, y){
    var m = (x) * (y);
    if (m < Number.MIN_VALUE || m > Number.MAX_VALUE) {
        throw new MathArithmeticException();
    }
    return m;
};

ArithmeticUtils.subAndCheck = function(x, y){
    var s = x - y;
    if (s < Number.MIN_VALUE || s > Number.MAX_VALUE) {
        throw new MathArithmeticException(LocalizedFormats.OVERFLOW_IN_SUBTRACTION, x, y);
    }
    return s;
};

ArithmeticUtils.pow = function(k, e){
    if (e < 0) {
        throw new NotPositiveException(LocalizedFormats.EXPONENT, e);
    }

    var result = 1;
    var k2p  = k;
    while (e != 0) {
        if ((e & 0x1) != 0) {
            result *= k2p;
        }
        k2p *= k2p;
        e = e >> 1;
    }

    return result;
};

ArithmeticUtils.stirlingS2 = function(n,k){
    if (k < 0) {
        throw new NotPositiveException(k);
    }
    if (k > n) {
        throw new NumberIsTooLargeException(k, n, true);
    }

    var stirlingS2 = STIRLING_S2;

    if (stirlingS2 == null) {
        // the cache has never been initialized, compute the first numbers
        // by direct recurrence relation

        // as S(26,9) = 11201516780955125625 is larger than Long.MAX_VALUE
        // we must stop computation at row 26
        var maxIndex = 26;
        stirlingS2 = makeArray(maxIndex, 1, 0);
        for (var i = 1; i < stirlingS2.length; ++i) {
            stirlingS2[i][0] = 0;
            stirlingS2[i][1] = 1;
            stirlingS2[i][i] = 1;
            for (var j = 2; j < i; ++j) {
                stirlingS2[i][j] = j * stirlingS2[i - 1][j] + stirlingS2[i - 1][j - 1];
            }
        }

        // atomically save the cache
        STIRLING_S2 = stirlingS2;

    }

    if (n < stirlingS2.length) {
        // the number is in the small cache
        return stirlingS2[n][k];
    } else {
        // use explicit formula to compute the number without caching it
        if (k == 0) {
            return 0;
        } else if (k == 1 || k == n) {
            return 1;
        } else if (k == 2) {
            return (1 << (n - 1)) - 1;
        } else if (k == n - 1) {
            return ArithmeticUtils.binomialCoefficient(n, 2);
        } else {
            // definition formula: note that this may trigger some overflow
            var sum = 0;
            var sign = ((k & 0x1) == 0) ? 1 : -1;
            for (var j = 1; j <= k; ++j) {
                sign = -sign;
                sum += sign * ArithmeticUtils.binomialCoefficient(k, j) * pow(j, n);
                if (sum < 0) {
                    // there was an overflow somewhere
                    throw new MathArithmeticException(LocalizedFormats.ARGUMENT_OUTSIDE_DOMAIN,
                        n, 0, stirlingS2.length - 1);
                }
            }
            return sum / ArithmeticUtils.factorial(k);
        }
    }
};

ArithmeticUtils.isPowerOfTwo = function(n){
    return (n > 0) && ((n & (n - 1)) == 0);
};

/**
 * From Integer.java
 */
function numberOfTrailingZeros(i) {
    // HD, Figure 5-14
    var y;
    if (i == 0) return 32;
    var n = 31;
    y = i <<16; if (y != 0) { n = n -16; i = y; }
    y = i << 8; if (y != 0) { n = n - 8; i = y; }
    y = i << 4; if (y != 0) { n = n - 4; i = y; }
    y = i << 2; if (y != 0) { n = n - 2; i = y; }
    return n - ((i << 1) >>> 31);
}

function makeArray(w, h, val) {
    var arr = [];
    for(i = 0; i < h; i++) {
        arr[i] = [];
        for(j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

module.exports = ArithmeticUtils;