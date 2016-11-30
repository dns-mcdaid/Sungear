/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
//ABSTRACT CLASS

//IMPLEMENT INHERITANCE
var RandomGenerator = require('./RandomGenerator');
var NotStrictlyPositiveException = require('../exception/NotStrictlyPositiveException');
var FastMath = require('../util/FastMath');
BitsStreamGenerator.prototype = Object.create(RandomGenerator.prototype);
BitsStreamGenerator.prototype.constructor = BitsStreamGenerator;

function BitsStreamGenerator(){
  this.nextGaussian = Number.NaN;
}
//Overridden methods from RandomGenerator
//abstract
BitsStreamGenerator.prototype.setSeed = function (seed) {};
BitsStreamGenerator.prototype.next = function(){};

BitsStreamGenerator.prototype.nextBytes = function (bytes) {
  var i = 0;
  var iEnd = bytes.length - 3;
  while(i < iEnd){
    var i = next(32);
    bytes[i] = random & 0xff;
    bytes[i+1] = (random >> 8) & 0xff;
    bytes[i+2] = (random >> 16) & 0xff;
    bytes[i+3] = (random >> 24) & 0xff;
    i+=4;
  }
  var random = next(32);
  while(i < bytes.length){
    bytes[i++] = random & 0xff;
    random = random >> 8;
  }
};
BitsStreamGenerator.prototype.nextDouble = function(){
  var high = next(26) << 26;
  var low = next(26);
  var returnVal = (high | low) * (2.220446049250313E-16);
  return returnVal;
};

BitsStreamGenerator.prototype.nextFloat = function () {
  return next(23) * 1.1920929E-7;
};

BitsStreamGenerator.prototype.nextGaussian = function () {
  var random;
  if(isNaN(this.nextGaussian)){
    var x = this.nextDouble();
    var y = this.nextDouble();
    var alpha = 2 * FastMath.PI * x;
    var r = Math.sqrt(-2 * FastMath.Log(y));
    random = r * Math.cos(alpha);
    this.nextGaussian = r * Math.sin(alpha);
  }else{
    random = this.nextGaussian;
    this.nextGaussian = Number.NaN;
  }
  return random;
};

BitsStreamGenerator.prototype.nextInt = function () {
  if(arguments.length === 0){
    return next(32);
  }
  else{
    var n = arguments[0];
    if(n > 0){
      if((n & n) == n){
        return (n * next(31)) >> 31;
      }
      var bits;
      var val;
      do{
        bits = next(31);
        val = bits % n;
      }while(bits - val + (n-1) < 0)
      return val;
    }
    throw new NotStrictlyPositiveException(n);
  }
};

BitsStreamGenerator.prototype.nextLong = function () {
  var high = (next(32)) << 32; x
  var low = (next(32)) & 4294967295;
  return high | low;
};

BitsStreamGenerator.prototype.clear = function(){
  this.nextGaussian = Number.NaN;
};

module.exports = BitsStreamGenerator;
