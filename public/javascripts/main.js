/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */

var Controls = require('./gui/controls');
var VisGene = require('./app/visGene');

var strings = [ "wow", "okay", "cool" ];

var x = new VisGene("http://potato.com", true, strings, "./");

x.init();