/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var FastMath = require("../util/FastMath");
var ContinuedFraction = require("../util/ContinuedFraction");
var MaxCountExceededException = require("../exception/MaxCountExceededException");
function Gamma(){}

Gamma = {


 INV_GAMMA1P_M1_A0 : 0.611609510448141581788E-08,

/** The constant {@code A1} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_A1 : 0.624730830116465516210E-08,

/** The constant {@code B1} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B1 : 0.203610414066806987300E+00,

/** The constant {@code B2} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B2 : 0.266205348428949217746E-01,

/** The constant {@code B3} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B3 : 0.493944979382446875238E-03,

/** The constant {@code B4} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B4 : -0.851419432440314906588E-05,

/** The constant {@code B5} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B5 : -0.643045481779353022248E-05,

/** The constant {@code B6} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B6 : 0.992641840672773722196E-06,

/** The constant {@code B7} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B7 : -0.607761895722825260739E-07,

/** The constant {@code B8} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_B8 : 0.195755836614639731882E-09,

/** The constant {@code P0} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P0 : 0.6116095104481415817861E-08,

/** The constant {@code P1} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P1 : 0.6871674113067198736152E-08,

/** The constant {@code P2} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P2 : 0.6820161668496170657918E-09,

/** The constant {@code P3} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P3 : 0.4686843322948848031080E-10,

/** The constant {@code P4} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P4 : 0.1572833027710446286995E-11,

/** The constant {@code P5} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P5 : -0.1249441572276366213222E-12,

/** The constant {@code P6} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_P6 : 0.4343529937408594255178E-14,

/** The constant {@code Q1} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_Q1 : 0.3056961078365221025009E+00,

/** The constant {@code Q2} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_Q2 : 0.5464213086042296536016E-01,

/** The constant {@code Q3} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_Q3 : 0.4956830093825887312020E-02,

/** The constant {@code Q4} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_Q4 : 0.2692369466186361192876E-03,

/** The constant {@code C} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C : -0.422784335098467139393487909917598E+00,

/** The constant {@code C0} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C0 : 0.577215664901532860606512090082402E+00,

/** The constant {@code C1} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C1 : -0.655878071520253881077019515145390E+00,

/** The constant {@code C2} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C2 : -0.420026350340952355290039348754298E-01,

/** The constant {@code C3} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C3 : 0.166538611382291489501700795102105E+00,

/** The constant {@code C4} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C4 : -0.421977345555443367482083012891874E-01,

/** The constant {@code C5} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C5 : -0.962197152787697356211492167234820E-02,

/** The constant {@code C6} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C6 : 0.721894324666309954239501034044657E-02,

/** The constant {@code C7} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C7 : -0.116516759185906511211397108401839E-02,

/** The constant {@code C8} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C8 : -0.215241674114950972815729963053648E-03,

/** The constant {@code C9} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C9 : 0.128050282388116186153198626328164E-03,

/** The constant {@code C10} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C10 : -0.201348547807882386556893914210218E-04,

/** The constant {@code C11} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C11 : -0.125049348214267065734535947383309E-05,

/** The constant {@code C12} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C12 : 0.113302723198169588237412962033074E-05,

/** The constant {@code C13} defined in {@code DGAM1}. */
 INV_GAMMA1P_M1_C13 : -0.205633841697760710345015413002057E-06,

 HALF_LOG_2_PI : 0.5 * Math.log((2.0 * Math.PI)),

 DEFAULT_EPSILON : 10e-15,

 LANCZOS_G : 607.0 / 128.0,

 GAMMA : 0.577215664901532860606512090082,
	C_LIMIT: 49,
	S_LIMIT: 1E-5,

 LANCZOS : [
        0.99999999999999709182,
        57.156235665862923517,
        -59.597960355475491248,
        14.136097974741747174,
        -0.49191381609762019978,
        0.33994649984811888699e-4,
        0.46523628927048575665e-4,
        -0.98374475304879564677e-4,
        0.15808870322491248884e-3,
        -0.21026444172410488319e-3,
        0.21743961811521264320e-3,
        -0.16431810653676389022e-3,
        0.84418223983852743293e-4,
        -0.26190838401581408670e-4,
        0.36899182659531622704e-5,
    ],

 invGamma1pm1: function(x) {
  console.log("Inside invGamma1pm1");
	if (x < -0.5) {
		console.log("Throw Number is Too Small exception from invGamma1pm1 function");
	}
	if (x > 1.5) {
		console.log("Throw Number is Too Large exception from invGamma1pm1 function");
	}

	var ret;
	var t = x <= 0.5 ? x : (x - 0.5) - 0.5;
	if (t < 0.0) {
		var a = this.INV_GAMMA1P_M1_A0 + t * this.INV_GAMMA1P_M1_A1;
		var b = this.INV_GAMMA1P_M1_B8;
		b = this.INV_GAMMA1P_M1_B7 + t * b;
		b = this.INV_GAMMA1P_M1_B6 + t * b;
		b = this.INV_GAMMA1P_M1_B5 + t * b;
		b = this.INV_GAMMA1P_M1_B4 + t * b;
		b = this.INV_GAMMA1P_M1_B3 + t * b;
		b = this.INV_GAMMA1P_M1_B2 + t * b;
		b = this.INV_GAMMA1P_M1_B1 + t * b;
		b = 1.0 + t * b;

		var c = this.INV_GAMMA1P_M1_C13 + t * (a / b);
		c = this.INV_GAMMA1P_M1_C12 + t * c;
		c = this.INV_GAMMA1P_M1_C11 + t * c;
		c = this.INV_GAMMA1P_M1_C10 + t * c;
		c = this.INV_GAMMA1P_M1_C9 + t * c;
		c = this.INV_GAMMA1P_M1_C8 + t * c;
		c = this.INV_GAMMA1P_M1_C7 + t * c;
		c = this.INV_GAMMA1P_M1_C6 + t * c;
		c = this.INV_GAMMA1P_M1_C5 + t * c;
		c = this.INV_GAMMA1P_M1_C4 + t * c;
		c = this.INV_GAMMA1P_M1_C3 + t * c;
		c = this.INV_GAMMA1P_M1_C2 + t * c;
		c = this.INV_GAMMA1P_M1_C1 + t * c;
		c = this.INV_GAMMA1P_M1_C + t * c;
		if (x > 0.5) {
			ret = t * c / x;
		} else {
			ret = x * ((c + 0.5) + 0.5);
		}
	} else {
		var p = this.INV_GAMMA1P_M1_P6;
		p = this.INV_GAMMA1P_M1_P5 + t * p;
		p = this.INV_GAMMA1P_M1_P4 + t * p;
		p = this.INV_GAMMA1P_M1_P3 + t * p;
		p = this.INV_GAMMA1P_M1_P2 + t * p;
		p = this.INV_GAMMA1P_M1_P1 + t * p;
		p = this.INV_GAMMA1P_M1_P0 + t * p;

		var q = this.INV_GAMMA1P_M1_Q4;
		q = this.INV_GAMMA1P_M1_Q3 + t * q;
		q = this.INV_GAMMA1P_M1_Q2 + t * q;
		q = this.INV_GAMMA1P_M1_Q1 + t * q;
		q = 1.0 + t * q;

		var c = this.INV_GAMMA1P_M1_C13 + (p / q) * t;
		c = this.INV_GAMMA1P_M1_C12 + t * c;
		c = this.INV_GAMMA1P_M1_C11 + t * c;
		c = this.INV_GAMMA1P_M1_C10 + t * c;
		c = this.INV_GAMMA1P_M1_C9 + t * c;
		c = this.INV_GAMMA1P_M1_C8 + t * c;
		c = this.INV_GAMMA1P_M1_C7 + t * c;
		c = this.INV_GAMMA1P_M1_C6 + t * c;
		c = this.INV_GAMMA1P_M1_C5 + t * c;
		c = this.INV_GAMMA1P_M1_C4 + t * c;
		c = this.INV_GAMMA1P_M1_C3 + t * c;
		c = this.INV_GAMMA1P_M1_C2 + t * c;
		c = this.INV_GAMMA1P_M1_C1 + t * c;
		c = this.INV_GAMMA1P_M1_C0 + t * c;

		if (x > 0.5) {
			ret = (t / x) * ((c - 0.5) - 0.5);
		} else {
			ret = x * c;
		}
	}
  console.log("Leaving invGamma1pm1");
	return ret;
},

 logGamma1p: function(x){
  console.log("Inside logGamma1p");
	if(x < -0.5){
		document.getElementById("output").innerHTML = "Throw Number is Too Small exception from logGamma1p function";
	}
	if(x > 1.5){
		document.getElementById("output").innerHTML = "Throw Number is Too Large exception from logGamma1p function";
	}
  console.log("Leaving logGamma1p");
	return -FastMath.Log1p(invGamma1pm1(x)); //FIXME!

},

 lanczos: function(x){
  console.log("Inside lanczos");
	var sum = 0.0;
	for(var i = this.LANCZOS.length - 1; i > 0; i--){
		sum = sum + (this.LANCZOS[i] / (x + i));
	}
  console.log("Leaving lanczos");
	return sum + this.LANCZOS[0];
},

 logGamma: function(x){
  console.log("Inside LogGamma");
	var ret;

	if (isNaN(x) || (x <= 0.0)) {
		ret = Number.NaN;
	} else if (x < 0.5) {
		return this.logGamma1p(x) - Math.log(x);
	} else if (x <= 2.5) {
		return this.logGamma1p((x - 0.5) - 0.5);
	} else if (x <= 8.0) {
		var n = Math.floor(x - 1.5);
		var prod = 1.0;
		for (i = 1; i <= n; i++) {
			prod *= x - i;
		}
		return this.logGamma1p(x - (n + 1)) + Math.log(prod);
	} else {
		var sum = lanczos(x);
		var tmp = x + this.LANCZOS_G + 0.5;
		ret = ((x + 0.5) * Math.log(tmp)) - tmp +
			this.HALF_LOG_2_PI + Math.log((sum / x));
	}
console.log("Leaving LogGamma");
	return ret;
	},
	regularizedGammaP: function(a, x, passedEpsilon, passedIterations){
	    var epsilon;
        var maxIterations;
        if(arguments.length == 2){
            epsilon = passedEpsilon;
            maxIterations = passedIterations;
        }
        var ret;

        if (isNaN(a) || isNaN(x) || (a <= 0.0) || (x < 0.0)) {
            ret = Number.NaN;
        } else if (x == 0.0) {
            ret = 0.0;
        } else if (x >= a + 1) {
            // use regularizedGammaQ because it should converge faster in this
            // case.
            ret = 1.0 - Gamma.regularizedGammaQ(a, x, epsilon, maxIterations);
        } else {
            // calculate series
            var n = 0.0; // current element index
            var an = 1.0 / a; // n-th element in the series
            var sum = an; // partial sum
            while (Math.abs(an/sum) > epsilon &&
            n < maxIterations &&
            sum < Number.POSITIVE_INFINITY) {
                // compute next element in the series
                n = n + 1.0;
                an = an * (x / (a + n));

                // update partial sum
                sum = sum + an;
            }
            if (n >= maxIterations) {
                throw new MaxCountExceededException(maxIterations);
            } else if (!isFinite(sum)) {
                ret = 1.0;
            } else {
                ret = Math.exp(-x + (a * Math.log(x)) - Gamma.logGamma(a)) * sum;
            }
        }

        return ret;


	},
	regularizedGammaQ: function(a, x, passedEpsilon, passedIterations){
		var epsilon;
		var maxIterations;
		if(arguments.length == 2){
			epsilon = Gamma.DEFAULT_EPSILON;
			maxIterations = Number.MAX_VALUE;
		}
		var ret;

		if (isNaN(a) || isNaN(x) || (a <= 0.0) || (x < 0.0)) {
			ret = Number.NaN;
		} else if (x == 0.0) {
			ret = 1.0;
		} else if (x < a + 1.0) {
			// use regularizedGammaP because it should converge faster in this
			// case.
			ret = 1.0 - Gamma.regularizedGammaP(a, x, epsilon, maxIterations);
		} else {
			// create continued fraction
			var fraction =  ContinuedFraction;
			fraction.getA = function(n, x){
			  return ((2.0 * n) + 1.0) - a + x;
            };
            fraction.getB = function(n, x){
              return n * (a - n);
            };

			ret = 1.0 / cf.evaluate(x, epsilon, maxIterations);
			ret = Math.exp(-x + (a * Math.log(x)) - Gamma.logGamma(a)) * ret;
		}

		return ret;
	},
	digamma: function(x){
		if (x > 0 && x <= Gamma.S_LIMIT) {
			// use method 5 from Bernardo AS103
			// accurate to O(x)
			return -Gamma.GAMMA - 1 / x;
		}

		if (x >= Gamma.C_LIMIT) {
			// use method 4 (accurate to O(1/x^8)
			var inv = 1 / (x * x);
			//            1       1        1         1
			// log(x) -  --- - ------ + ------- - -------
			//           2 x   12 x^2   120 x^4   252 x^6
			return Math.log(x) - 0.5 / x - inv * ((1.0 / 12) + inv * (1.0 / 120 - inv / 252));
		}

		return Gamma.digamma(x + 1) - 1 / x;
	},
	trigamma: function(x){
		if (x > 0 && x <= Gamma.S_LIMIT) {
			return 1 / (x * x);
		}

		if (x >= Gamma.C_LIMIT) {
			var inv = 1 / (x * x);
			//  1    1      1       1       1
			//  - + ---- + ---- - ----- + -----
			//  x      2      3       5       7
			//      2 x    6 x    30 x    42 x
			return 1 / x + inv / 2 + inv / x * (1.0 / 6 - inv * (1.0 / 30 + inv / 42));
		}

		return Gamma.trigamma(x + 1) + 1 / (x * x);
	},
	gamma: function(x){
		if ((x == FastMath.rint(x)) && (x <= 0.0)) {
			return Number.NaN;
		}
		var ret;
		var absX = Math.abs(x);
		if (absX <= 20.0) {
			if (x >= 1.0) {
				/*
				 * From the recurrence relation
				 * Gamma(x) = (x - 1) * ... * (x - n) * Gamma(x - n),
				 * then
				 * Gamma(t) = 1 / [1 + invGamma1pm1(t - 1)],
				 * where t = x - n. This means that t must satisfy
				 * -0.5 <= t - 1 <= 1.5.
				 */
				var prod = 1.0;
				var t = x;
				while (t > 2.5) {
					t = t - 1.0;
					prod *= t;
				}
				ret = prod / (1.0 + Gamma.invGamma1pm1(t - 1.0));
			} else {
				/*
				 * From the recurrence relation
				 * Gamma(x) = Gamma(x + n + 1) / [x * (x + 1) * ... * (x + n)]
				 * then
				 * Gamma(x + n + 1) = 1 / [1 + invGamma1pm1(x + n)],
				 * which requires -0.5 <= x + n <= 1.5.
				 */
				var prod = x;
				var t = x;
				while (t < -0.5) {
					t = t + 1.0;
					prod *= t;
				}
				ret = 1.0 / (prod * (1.0 + Gamma.invGamma1pm1(t)));
			}
		} else {
			var y = absX + Gamma.LANCZOS_G + 0.5;
			var gammaAbs = Gamma.SQRT_TWO_PI / x *
				Math.pow(y, absX + 0.5) *
				FastMath.exp(-y) * Gamma.lanczos(absX);
			if (x > 0.0) {
				ret = gammaAbs;
			} else {
				/*
				 * From the reflection formula
				 * Gamma(x) * Gamma(1 - x) * sin(pi * x) = pi,
				 * and the recurrence relation
				 * Gamma(1 - x) = -x * Gamma(-x),
				 * it is found
				 * Gamma(x) = -pi / [x * sin(pi * x) * Gamma(-x)].
				 */
				ret = -Math.PI /
					(x * Math.sin(Math.PI * x) * gammaAbs);
			}
		}
		return ret;

	}

};

module.exports = Gamma;