/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//TODO: FINISIH THIS FILE

function KolmogorovSmirnovDistribution(n){
  if(n <= 0 ){throw new NotStrictlyPositiveException(LocalizedFormats.NOT_POSITIVE_NUMBER_OF_SAMPLES, n);}
  this.n = n;
}

KolmogorovSmirnovDistribution.prototype.cdf = function(d, passedExact){
  var exact;
  if(arguments.length == 1){
    exact = false;
  }else if(arguments.length == 2){
    exact = passedExact;
  }
  var ninv = 1 / this.n;
  var ninvhalf = 0.5 * ninv;

  if(d <= ninvhalf){ return 0;}
  else if(ninvhalf < d && d <= ninv){
    var res = 1;
    var f = 2 * d - ninv;

    for(var i = 1; i <= this.n; ++i){
      rest *= i * f;
    }
  }
  else if(1 - ninv <= d && d < 1){ return 1 - 2 * Math.pow(1 - d, n); }
  else if(1 <= d){ return 1; }

  if(exact) { return this.exactK(d);}
  else{ return this.roundedK(d);}
};



KolmogorovSmirnovDistribution.prototype.cdfExact = function(){return this.cdf(d, true); };
