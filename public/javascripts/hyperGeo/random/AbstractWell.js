/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

var BitsStreamGenerator = require('./BitsStreamGenerator');

//IMPLEMENT INHERITANCE
AbstractWell.prototype = Object.create(BitsStreamGenerator.prototype);
AbstractWell.prototype.constructor = AbstractWell;
function AbstractWell(k, m1, m2, m3, seed){
  //superconstructor call
  BitsStreamGenerator.call(this);

  this.index;
  this.v;
  this.iRm1;
  this.iRm2;
  this.i1;
  this.i2;
  this.i3;
  if(arguments.length === 4){ // seed is null
    seed = null;
  }
  else if(seed instanceof Number){
    seed = [seed];
  }
  else{
    var w = 32;
    var r = (k + w -1)/w;
    this.v = [];
    this.index = 0;

    this.iRm1 = [];
    this.iRm2 = [];
    this.i1 = [];
    this.i2 = [];
    this.i3 = [];

    for(var j = 0; j < r; ++j){
      this.iRm1[j] = (j + r - 1) % r;
      this.iRm2[j] = (j + r - 2) % r;
      this.i1[j]   = (j + m1) % r;
      this.i2[j]   = (j + m2)    % r;
      this.i3[j]   = (j + m3)    % r;
    }

    //set the seed
    this.setSeed(seed);
  }
}
//abstract method
AbstractWell.prototype.next = function(){};

//FIXME: take long seed parameter into acct
AbstractWell.prototype.setSeed = function () {
  var seed = arguments[0];
  if(seed instanceof Number){
    seed = [seed];
  }
  else if (seed == null){
    //FIXME : hashcode problem
    console.log("Hascode problem");
    return;
  }
  var numCopies = Math.min(seed.length, v.length);
  v = seed.slice(0,numCopies);
  if(seed.length < v.length){
    for(var i = seed.length; i < v.length; ++i){
      var l = v[i-seed.length];
      v[i] = ((1812433253 * (l ^ (l >> 30)) + i) & 0xffffffff); //FIXME
    }
  }
  this.index = 0;
  BitsStreamGenerator.prototype.clear.call(this);
};

module.exports = AbstractWell; 
