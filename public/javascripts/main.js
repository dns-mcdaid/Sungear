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
    var vis;
    
    p5.setup = function() {
        WIDTH = document.getElementById('sungearGui').offsetWidth;
        HEIGHT = document.getElementById('sungearGui').offsetHeight;
        canvas = p5.createCanvas(WIDTH,HEIGHT);
        p5.frameRate(30);
        p5.textSize(30);
        p5.textAlign(p5.CENTER);
        vis = VisGene.main(args);
    };
    p5.draw = function() {
        p5.background("#111111");

        //vis.gear.paintComponent(p5);
        vis.gear.displayButtons(p5)
    };

    p5.mouseMoved = function() {
        vis.gear.checkHighlight(p5);
    };

    p5.mouseDragged = function() {
        vis.gear.checkHighlight(p5);
        if (!vis.gear.multi) {
            vis.gear.checkSelect(p5);
        }
    };

    p5.mousePressed = function() {
        if (!vis.gear.multi) {
            vis.gear.checkSelect(p5);
        }
    };

    p5.mouseReleased = function() {
        vis.gear.handleSelect(p5);
    };

}, 'sungearGui');