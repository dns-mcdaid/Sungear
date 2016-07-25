/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 *
 * @author RajahBimmy
 */

const Icons = require('./gui/sungear/icons');
const SunGear = require('./gui/sunGear');

const p5 = require('p5');
const VisGene = require('./app/visGene');

var args = [ "" ];

var hereWeGo = new p5(function(p5) {
    var WIDTH;
    var HEIGHT;
    var canvas;
    
    var prevB;
    var selB;
    var nextB;
    var statsB;
    
    p5.setup = function() {
        WIDTH = document.getElementById('sungearGui').offsetWidth;
        HEIGHT = document.getElementById('sungearGui').offsetHeight;
        canvas = p5.createCanvas(WIDTH,HEIGHT);

        prevB = new Icons.ArrowIcon(2, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        selB = new Icons.EllipseIcon(3, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        nextB = new Icons.ArrowIcon(0, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        statsB = new Icons.StatsIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT);
    };
    p5.draw = function() {
        p5.background("#111111");
        prevB.paintIcon(null, p5, 10, HEIGHT-30);
        selB.paintIcon(null, p5, 36, HEIGHT-22);
        nextB.paintIcon(null, p5, 45, HEIGHT-30);
        statsB.paintIcon(null, p5, 28, HEIGHT-55);
    };
    //VisGene.main(args);

}, 'sungearGui');