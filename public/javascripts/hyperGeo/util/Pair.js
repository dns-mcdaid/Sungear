/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

function Pair(K, V){
    this.key = K;
    this.value = V;
}

Pair.prototype = {
    getKey: function(){
        return this.key;
    },
    getValue: function(){
        return this.value;
    },
    getFirst: function(){
        return this.key;
    },
    getSecond: function(){
        return this.value;
    },
    equals: function(o){
        if(this === 0){
            return true;
        }if(!(o instanceof Pair)){
            return false;
        }else{
            var oP = o;
            return (this.key == null ? oP.key == null : this.key.equals(oP.key) &&
            (this.value == null ? oP.value == null : this.value.equals(oP.value)));
        }
    },
};

module.exports = Pair;