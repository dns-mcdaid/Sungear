/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */


var p5 = require('p5');
var geneTest= require('./test/geneTest');

geneTest.testVessel();

var aPls = document.getElementsByTagName("a")[0];

aPls.addEventListener("click", function() {
    alert("OH NO! IT WORKED!");
});
