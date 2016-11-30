/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var AbstractWell = require('./AbstractWell');

//IMPLEMENT INHERITANCE
Well19937c.prototype = Object.create(AbstractWell.prototype);
Well19937c.prototype.constructor = Well19937c;


function Well19937c(){

    this.K = 19937;
    this.M1 = 70;
    this.M2 = 179;
    this.M3 = 449;
  if(arguments.length > 0){
    var seed = arguments[0];
    AbstractWell.call(this, this.K, this.M1, this.M2, this.M3, seed);
  }else{
    AbstractWell.call(this, this.K, this.M1, this.M2, this.M3);
  }


}

Well19937c.prototype.next = function (bits){
  var indexRm1 = this.iRM1[this.index];
  var indexRm2 = this.iRm2[this.index];

  var v0 = this.v[this.index];
  var vM1 = this.v[this.i1[this.index]];
  var vM2 = this.v[this.i2[this.index]];
  var vM3 = this.v[this.i3[this.idnex]];

  var z0 = (0x80000000 & this.v[indexRm1]) ^ (0x7FFFFFFF & this.v[indexRm2]);
  var z1 = (v0 ^ (v0 << 25))  ^ (vM1 ^ (vM1 >>> 27));
  var z2 = (vM2 >>> 9) ^ (vM3 ^ (vM3 >>> 1));
  var z3 = z1^z2;
  var z4 = z0 ^ (z1 ^ (z1 << 9)) ^ (z2 ^ (z2 << 21)) ^ (z3 ^ (z3 >>> 21));

  this.v[this.index]= z3;
  this.v[indexRm1]  = z4;
  this.v[indexRm2] &= 0x80000000;
  this.index = indexRm1;


  // add Matsumoto-Kurita tempering
  // to get a maximally-equidistributed generator
  z4 = z4 ^ ((z4 <<  7) & 0xe46e1700);
  z4 = z4 ^ ((z4 << 15) & 0x9b868000);

  return z4 >>> (32 - bits);
};

module.exports = Well19937c;
