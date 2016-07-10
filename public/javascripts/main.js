/**
 * Created by dennismcdaid on 7/10/16.
 */
/** BEFORE RUNNING: Navigate to the overarching Sungear folder, then run browserify public/javascripts/main.js -o public/javascripts/out.js -d */


var p5 = require('p5');
var Anchor = require('./genes/anchor');
var Vessel = require('./genes/vessel');
var Gene = require('./genes/gene');

var anchors = [];
for (var i = 0; i < 10; i++) {
    anchors.push(new Anchor("potato" + i));
}

var myTest = new Vessel(anchors);

for (var j = 0; j < 10; j++) {
    var title = "abc" + j;
    var x = new Gene(title, "a lot of fun.");
    myTest.addGene(x);
}

console.log(JSON.stringify(myTest));
console.log(myTest.getFullCount());
myTest.cleanup();
console.log(myTest);