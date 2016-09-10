/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
    function FastMath(){}

    FastMath.E = 2850325.0 / 1048576.0 + 8.254840070411028747e-8;

	FastMath.RECOMPUTE_TABLES_AT_RUNTIME  = false;

	FastMath.EXP_INT_TABLE_MAX_INDEX  = 750;

	FastMath.EXP_INT_TABLE_LEN = EXP_INT_TABLE_MAX_INDEX * 2;

	FastMath.LN_MANT_LEN = 1024;

	FastMath.EXP_FRAC_TABLE_LEN = 1025;

	FastMath.TWO_POWER_52 = 4503599627370496.0;

	FastMath.TWO_POWER_53 = 2 * TWO_POWER_52;

	FastMath.F_1_2 = 1/2;

	FastMath.F_1_3 = 1/3;

	FastMath.HEX_40000000 = 0x40000000;

	FastMath.LN_2_A = 0.693147063255310059;

	FastMath.LN_2_B = 1.17304635250823482e-7;

	FastMath.LN_MANT;

	FastMath.EXP_INT_TABLE_A;

	FastMath.EXP_INT_TABLE_B;

	FastMath.LN_QUICK_COEF = [
		[1.0, 5.669184079525E-24],
		[-0.25, -0.25],
		[0.3333333134651184, 1.986821492305628E-8],
		[-0.25, -6.663542893624021E-14],
		[0.19999998807907104, 1.1921056801463227E-8],
		[-0.1666666567325592, -7.800414592973399E-9],
		[0.1428571343421936, 5.650007086920087E-9],
		[-0.12502530217170715, -7.44321345601866E-11],
		[0.11113807559013367, 9.219544613762692E-9],
	];

	FastMath.LN_HI_PREC_COEF = [
		[1.0, -6.032174644509064E-23],
		[-0.25, -0.25],
		[0.3333333134651184, 1.9868161777724352E-8],
		[-0.2499999701976776, -2.957007209750105E-8],
		[0.19999954104423523, 1.5830993332061267E-10],
		[-0.16624879837036133, -2.6033824355191673E-8]
	];

	// 	lnMant: function(){
	// 	// 	if (RECOMPUTE_TABLES_AT_RUNTIME) {
	// 	// 	LN_MANT = new double[FastMath.LN_MANT_LEN][];
	// 	//
	// 	// 	// Populate lnMant table
	// 	// 	for (int i = 0; i < LN_MANT.length; i++) {
	// 	// 		final double d = Double.longBitsToDouble( (((long) i) << 42) | 0x3ff0000000000000L );
	// 	// 		LN_MANT[i] = FastMathCalc.slowLog(d);
	// 	// 	}
	// 	// } else { FIXME: IGNORING THIS FOR NOW!
	// 		// LN_MANT = FastMathLiteralArraysLoadLnMant();
	// 	//}
	//
	//
	//
	// },


	// 	ExpIntTable: function(){
	// 	// 	if(RECOMPUTE_TABLES_AT_RUNTIME){
	// 	// 		var EXP_INT_TABLE_A = new Array(EXP_INT_TABLE_LEN);
	// 	// 		var EXP_INT_TABLE_B = NEW Array(EXP_INT_TABLE_LEN);
	// 	//
	// 	// 		var tmp = new Array(2);
	// 	// 		var recip = new Array(2);
	// 		//FIXME: IGNORING THIS FOR NOW. HAVE TO IMPLEMENT FASTMATHCALC METHODS
	// 		// 	for(i = 0; i < EXP_INT_TABLE_MAX_INDEX; i++){
	// 	// 			FastMathCalcExpint(i, tmp);
	// 	// 			EXP_INT_TABLE_A[i + EXP_INT_TABLE_MAX_INDEX] = tmp[0];
	// 	// 			EXP_INT_TABLE_B[i + EXP_INT_TABLE_MAX_INDEX] = tmp[1];
	// 	//
	// 	// 			if(i != 0){
	// 	// 				FastMathCalcSplitReciprocal(tmp, recip);
	// 	// 				    EXP_INT_TABLE_A[FastMath.EXP_INT_TABLE_MAX_INDEX - i] = recip[0];
	// 	//                     EXP_INT_TABLE_B[FastMath.EXP_INT_TABLE_MAX_INDEX - i] = recip[1];
	// 	//
	// 	//
	// 	// 			}
	// 	// 		}
	// 	// 	}else{
	// 		     EXP_INT_TABLE_A = FastMathLiteralArraysLoadExpIntA();
	// 	         EXP_INT_TABLE_B = FastMathLiteralArraysLoadExpIntB();
	// 	//	}
	//
	//
	// },

FastMath.min = function(a, b){
			if(a <= b){ return a;}
			else return b;

		};

FastMath.max = function(a, b){
			if(a <= b){ return b;}
			else return a;

		};


FastMath.exp = function(x, extra, hiPrec){
			return Math.exp(x);
		};

FastMath.Log = function(x, hiPrec){
			return Math.log(x);
		};



FastMath.abs = function(x){
			if(x < 0){return -x;}
			return x;
		};

FastMath.Floor = function(x){
			if(isNaN(x)){
				return x;
			}
			if (x >= TWO_POWER_52 || x <= -TWO_POWER_52) {
				return x;
			}
			return Math.floor(x);


		};

FastMath.Log1p = function(x){ //needed in Gamma.js
			if(x == -1){
				return Number.NEGATIVE_INFINITY;
			}
			if(x == Number.POSITIVE_INFINITY){
				return Number.POSITIVE_INFINITY;
			}
			if (x > 1e-6 || x < -1e-6) {
					var xpa = 1 + x;
					var xpb = -(xpa - 1 - x);
					hiPrec = [];
					var lores = Math.Log(xpa, hiPrec);
					if(!isFinite(lores)){
						return lores;
					}

					var fx1 = xpb/xpa;
					var epsilon =  0.5 * fx1 + 1;
					return epsilon * fx1 + hiPrec[1] + hiPrec[0];
				}else{
					var y = (x * F_1_3 - F_1_2) * x + 1;
					return y * x;
			}
		};


		//CODE TAKEN FROM
		//https://gist.github.com/Yaffle/4654250
		//I DO NOT OWN
FastMath.NextUp = function(x) {
		    x = Number(x);
		    if (x !== x) {
		      return x;
		    }
		    if (x === -Number.POSITIVE_INFINITY) {
		      return -Number.MAX_VALUE;
		    }
		    if (x === Number.POSITIVE_INFINITY) {
		      return Number.POSITIVE_INFINITY;
		    }
		    if (x === +Number.MAX_VALUE) {
		      return Number.POSITIVE_INFINITY;
		    }
		    var y = x * (x < 0 ? 1 - Number.EPSILON / 2 : 1 + Number.EPSILON);
		    if (y === x) {
		      var MIN_VALUE = Number.MIN_VALUE;
		      if (MIN_VALUE === 0) {
		        MIN_VALUE = 2.2250738585072014e-308;
		      }
		      if (5e-324 !== 0 && 5e-324 < MIN_VALUE) {
		        MIN_VALUE = 5e-324;
		      }
		      y = x + MIN_VALUE;
		    }
		    if (y === Number.POSITIVE_INFINITY) {
		      y = Number.MAX_VALUE;
		    }
		    var b = x + (y - x) / 2;
		    if (x < b && b < y) {
		      y = b;
		    }
		    var c = (y + x) / 2;
		    if (x < c && c < y) {
		      y = c;
		    }
		    return y === 0 ? -0 : y;
        };

FastMath.ULP = function(x) {
		  	x = Number(x);
			return x < 0 ? NextUp(x) - x : x - (-NextUp(-x));
		};
FastMath.rint = function(x){
    var y = Math.floor(x);
    var d = x - y;
    if (d > 0.5) {
        if (y == -1.0) {
            return -0.0; // Preserve sign of operand
        }
        return y+1.0;
    }
    if (d < 0.5) {
        return y;
    }

    if(y % 2 == 0){
        return y;
    }else{
        return y + 1.0;
    }
};

	module.exports = FastMath;
