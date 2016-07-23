/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */

function Plant(year, type) {
    this.year = year;
    this.type = type;
    this.contents = new Potato("Red");
}


function Potato(name) {
    this.name = name;
}

Potato.prototype.fightWithMeAtCheesecake = function(parent) {
    parent.year = 1969;
};

var x = new Plant(2016, "tree");

console.log(x.year);

x.contents.fightWithMeAtCheesecake(x);

console.log(x.year);