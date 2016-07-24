/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/
var BitsStreamGenerator = require("./BitsStreamGenerator");
var iRm1 = [];
var iRm2 = [];
var i1 = [];
var i2 = [];
var i3 = [];
function AbstractWell(k, m1, m2, m3, seed){
    var passedSeed;
    if(arguments.length == 4){ //null seed
        passedSeed = null;
    }else{
        passedSeed = seed;
    }
    if(seed instanceof Number){
      passedSeed = [seed];
    }
    var w = 32;
    var r = (k + w - 1)/w;
    this.v = [r];
    this.index = 0;

    iRm1 = [r];
    iRm2 = [r];
    i1 = [r];
    i2 = [r];
    i3 = [r];
    for(var j = 0; j < r; ++j){
        iRm1[j] = (j + r - 1) % r;
        iRm2[j] = (j + r - 2) % r;
        i1[j]   = (j + m1)    % r;
        i2[j]   = (j + m2)    % r;
        i3[j]   = (j + m3)    % r;
    }
    console.log(typeof seed);
    this.setSeed(passedSeed);

}

AbstractWell.prototype = Object.create(BitsStreamGenerator.prototype);
AbstractWell.prototype.constructor = BitsStreamGenerator;

AbstractWell.prototype = {
    constructor: AbstractWell,
    setSeed: function(seed){

        var self = this;
        if(seed instanceof Number){
            var array = [seed];
            self.setSeed.call(self,array);
        }
        if(seed == null){
            self.setSeed.call(self, [Date.now()]);
            return;
        }
        this.v = seed.slice(0, Math.min(seed.length, this.v.length));
        if(seed.length < this.v.length){
            for(var i = seed.length; i < this.v.length; ++i){
                var l = this.v[i-seed.length];
                this.v[i] = ((1812433253 * (l ^ (l >> 30)) + i) & 0xffffffff);
            }
        }
        this.index = 0;
        this.clear();
    }
};
module.exports = AbstractWell;