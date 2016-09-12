/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

function ArgUtils(){}

ArgUtils.flatten = function(array) {
    var list = [];
    if(array !== null){
        array.forEach(function(item, index){
           if(item instanceof Array){
                var another = ArgUtils.flatten(item);
                another.forEach(function(item, index){
                   list.push(item);
                });
            }else{
                list.push(item);
           }
        });
        return list;
    }

};

module.exports = ArgUtils;