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
    var toggleArrows;
    var min;
    var vis;
    
    p5.setup = function() {
        WIDTH = document.getElementById('sungearGui').offsetWidth;
        HEIGHT = document.getElementById('sungearGui').offsetHeight;
        canvas = p5.createCanvas(WIDTH,HEIGHT);
        p5.frameRate(30);
        p5.textSize(30);
        p5.textAlign(p5.CENTER);
        vis = VisGene.main(args);

        // prevB = new Icons.ArrowIcon(2, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        // selB = new Icons.EllipseIcon(3, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        // nextB = new Icons.ArrowIcon(0, 4, SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        // statsB = new Icons.StatsIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT);
        // toggleArrows = new Icons.ShowArrowIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, false);
        // min = new Icons.VesselMinIcon(SunGear.C_PLAIN, SunGear.C_HIGHLIGHT, SunGear.C_SELECT, 5, 2, 1);
    };
    p5.draw = function() {
        p5.background("#111111");

        // prevB.paintIcon(p5, 10, HEIGHT-30);
        // selB.paintIcon(p5, 35.5, HEIGHT-22);
        // nextB.paintIcon(p5, 45, HEIGHT-30);
        //
        // toggleArrows.paintIcon(p5, 20, HEIGHT-50);
        // min.paintIcon(p5, 20, HEIGHT-75);
        // statsB.paintIcon(p5, 13, HEIGHT-108);
        var visuals = vis.getSunGearVisuals();
        for (var i = 0; i < visuals.length; i++) {
            var visual = visuals[i];
            var visFunction = visual.drawFunction;
            if (visual.draw) {
                visFunction(p5, visual.params);
            }
        }
    };

    p5.mouseReleased = function() {
        
    };

    // p5.mouseReleased = function() {
    //     if (p5.dist(p5.mouseX, p5.mouseY, 20, HEIGHT-75) < min.stepSize * min.steps) {
    //         if (min.step == min.steps - 1) {
    //             min.step = 0;
    //         } else {
    //             min.step++;
    //         }
    //     }
    // };

}, 'sungearGui');