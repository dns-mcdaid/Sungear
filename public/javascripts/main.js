/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 *
 * @author RajahBimmy
 */

const p5 = require('p5');
const VisGene = require('./app/visGene');
const Signal = require('./app/signal');

var args = [ "" ];
var vis;

new p5(function(p5) {
    var WIDTH;
    var HEIGHT;
    var canvas;

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
        vis.gear.paintExterior(p5);
        //vis.gear.paintComponent(p5);
        vis.gear.makeButtons(p5);
    };

    p5.mouseMoved = function() {
        // vis.gear.checkHighlight(p5);
    };

    p5.mouseDragged = function() {
        // vis.gear.checkHighlight(p5);
        // if (!vis.gear.multi) {
        //     vis.gear.checkSelect(p5);
        // }
    };

    p5.mousePressed = function() {
        // if (!vis.gear.multi) {
        //     vis.gear.checkSelect(p5);
        // }
    };

    p5.mouseReleased = function() {
        // vis.gear.handleSelect(p5);
        vis.gear.handleButtons(p5);
    };

    p5.mouseClicked = function() {
        setTimeout(receiveSignal, 100);
    };

    var receiveSignal = function() {
        if (vis.signal !== null) {
            switch(vis.signal) {
                case Signal.SCREENSHOT:
                    var fName = 'SunGear Session ';

                    var today = new Date();
                    var minute = today.getMinutes();
                    var hour = today.getHours();
                    var day = today.getDate();
                    var month = today.getMonth()+1;
                    var year = today.getFullYear();

                    if (month < 10) {   month = '0' + month;    }
                    if (day < 10) { day = '0' + day;    }
                    if (hour < 10) {    hour = '0' + hour;  }
                    if (minute < 10) {  minute = '0' + minute;  }
                    fName += year+'/'+month+'/'+day+' '+hour+'.'+minute+'.jpg';

                    p5.save(fName);
                    vis.signal = null;
                    break;
                case Signal.FULLSCREEN:
                    var fs = p5.fullscreen();
                    p5.fullscreen(!fs);
                    vis.signal = null;
                    break;
                default:
                    vis.signal = null;
                    break;
            }
        }
    }

}, 'sungearGui');
