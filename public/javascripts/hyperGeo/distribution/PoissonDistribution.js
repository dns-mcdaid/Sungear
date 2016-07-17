/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
PoissonDistribution.prototype = Object.create(AbstractIntegerDistribution.prototype);
PoissonDistribution.prototype.constructor = PoissonDistribution;
var DEFAULT_MAX_ITERATIONS = 10000000;
var DEFAULT_EPSILON = 1e-12;
var mean;
var normal; //NormalDistribution Object
var exponential; //ExponentialDistribution object

//used for testing if parameter passed to constructor is int or float
function is_int(mixed_var) {
  //  discuss at: http://phpjs.org/functions/is_int/
  // original by: Alex
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: WebDevHobo (http://webdevhobo.blogspot.com/)
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  //  revised by: Matt Bradley
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //        note: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //        note: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_int(23)
  //   returns 1: true
  //   example 2: is_int('23')
  //   returns 2: false
  //   example 3: is_int(23.5)
  //   returns 3: false
  //   example 4: is_int(true)
  //   returns 4: false

  return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
}

function PoissonDistribution(rng, p, epsilon, maxIterations){
  var passedRNG;
  var passedP;
  if(arguments.length == 1){//(p)
    passedRNG = new Well19937c();
    passedP = rng;
    this.epsilon = DEFAULT_EPSILON;
    this.maxIterations = DEFAULT_MAX_ITERATIONS;
  }else if(arguments.length == 2){//(p, double epsilon) or (p, int maxIterations)
    passedRNG = new Well19937c();
    passedP = rng;

    //second arg is variable based on whether it's a float or int
    var secondArg = arguments[1];
    if(is_int(secondArg)){ //the second arg is maxIterations
      this.epsilon = p;
      this.maxIterations = DEFAULT_MAX_ITERATIONS;
    }else{ //second arg is epsilon
      this.epsilon = DEFAULT_EPSILON;
      this.maxIterations = p;
    }
  }else if(arguments.length == 3){//(p, epsilon, maxIterations)
    passedRNG = new Well19937c();
    passedP = rng;
    this.epsilon = p;
    this.maxIterations = epsilon;
  }else{ //all 4
    passedRNG = rng;
    passedP = p;
    this.epsilon = epsilon;
    this.maxIterations = maxIterations;
  }
  if (passedP <= 0) { throw new NotStrictlyPositiveException(LocalizedFormats.MEAN, passedP);}
  AbstractIntegerDistribution.call(this, passedRNG);
  normal = new NormalDistribution(passedRNG, passedP, Math.sqrt(passedP),NormalDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY );
  exponential = new ExponentialDistribution(passedRNG, 1, ExponentialDistribution.DEFAULT_INVERSE_ABSOLUTE_ACCURACY);

}





PoissonDistribution.prototype.getMean = function() {return mean;};


PoissonDistribution.prototype.probability = function(x) {
  var ret;
  if (x < 0 || x == Number.MAX_VALUE) {
      ret = 0.0;
  } else if (x === 0) {
      ret = Math.exp(-mean);
  } else {
      ret = Math.exp(-SaddlePointExpansion.getStirlingError(x) -
            SaddlePointExpansion.getDeviancePart(x, mean)) /
            Math.sqrt(MathUtils.TWO_PI * x);
  }
  return ret;
};

PoissonDistribution.prototype.cumulativeProbability = function(x) {
  if (x < 0) {
      return 0;
  }
  if (x == Number.MAX_VALUE) {
      return 1;
  }
  return Gamma.regularizedGammaQ(x + 1, mean, this.epsilon, this.maxIterations);
};
PoissonDistribution.prototype.normalApproximateProbability = function (x)  {return normal.cumulativeProbability(x + 0.5);};
PoissonDistribution.prototype.getNumericalMean = function() {return this.getMean();};
PoissonDistribution.prototype.getNumericalVariance = function() {return this.getMean();};
PoissonDistribution.prototype.getSupportLowerBound = function() {return 0;};
PoissonDistribution.prototype.getSupportUpperBound = function() {return Number.MAX_VALUE;};
PoissonDistribution.prototype.isSupportConnected = function() {return true;};
//@Override
PoissonDistribution.prototype.sample = function() {
  return Math.min(this.nextPoisson(this.mean), Number.MAX_VALUE);

};

PoissonDistribution.prototype.nextPoisson = function(meanPoisson) {
  var pivot = 40.0;
  if (meanPoisson < pivot) {
      var p = Math.exp(-meanPoisson);
      var n = 0;
      var r = 1.0;
      var rnd = 1.0;

      while (n < 1000 * meanPoisson) {
          rnd = this.random.nextDouble();
          r = r * rnd;
          if (r >= p) {
              n++;
          } else {
              return n;
          }
      }
      return n;
  } else {
      var lambda = Math.floor(meanPoisson);
      var lambdaFractional = meanPoisson - lambda;
      var logLambda = Math.log(lambda);
      var logLambdaFactorial = ArithmeticUtils.factorialLog(lambda);
      var y2;
      if(lambdaFractional < Number.MIN_VALUE){
          y2 = 0;
      }else{
        y2 = this.nextPoisson(lambdaFractional);
      }
      var delta = Math.sqrt(lambda * Math.log(32 * lambda / FastMath.PI + 1));
      var halfDelta = delta / 2;
      var twolpd = 2 * lambda + delta;
      var a1 = Math.sqrt(FastMath.PI * twolpd) * Math.exp(1 / 8 * lambda);
      var a2 = (twolpd / delta) * Math.exp(-delta * (1 + delta) / twolpd);
      var aSum = a1 + a2 + 1;
      var p1 = a1 / aSum;
      var p2 = a2 / aSum;
      var c1 = 1 / (8 * lambda);

      var x = 0;
      var y = 0;
      var v = 0;
      var a = 0;
      var t = 0;
      var qr = 0;
      var qa = 0;
      for (;;) {
          var u = this.random.nextDouble();
          if (u <= p1) {
              var n = this.random.nextGaussian();
              x = n * Math.sqrt(lambda + halfDelta) - 0.5;
              if (x > delta || x < -lambda) {
                  continue;
              }
              if( x < 0 ){
                y = Math.floor(x);
              }else{
                y = Math.ceil(x);
              }
              var e = exponential.sample();
              v = -e - (n * n / 2) + c1;
          } else {
              if (u > p1 + p2) {
                  y = lambda;
                  break;
              } else {
                  x = delta + (twolpd / delta) * exponential.sample();
                  y = Math.ceil(x);
                  v = -exponential.sample() - delta * (x + 1) / twolpd;
              }
          }
          if(x < 0){ a = 1;}
          else{ a = 0;}
          t = y * (y + 1) / (2 * lambda);
          if (v < -t && a === 0) {
              y = lambda + y;
              break;
          }
          qr = t * ((2 * y + 1) / (6 * lambda) - 1);
          qa = qr - (t * t) / (3 * (lambda + a * (y + 1)));
          if (v < qa) {
              y = lambda + y;
              break;
          }
          if (v > qr) {
              continue;
          }
          if (v < y * logLambda - ArithmeticUtils.factorialLog((int) (y + lambda)) + logLambdaFactorial) {
              y = lambda + y;
              break;
          }
      }
      return y2 + y;
  }
};
