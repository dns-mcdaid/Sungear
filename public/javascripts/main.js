/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 *
 * @author RajahBimmy
 */

const p5 = require('p5');

var hereWeGo = new p5(function(p5) {
    var WIDTH;
    var HEIGHT;
    var canvas;
    p5.setup = function() {
        WIDTH = document.getElementById('sungearGui').offsetWidth;
        HEIGHT = document.getElementById('sungearGui').offsetHeight;
        canvas = p5.createCanvas(WIDTH,HEIGHT);
    };
    p5.draw = function() {
        p5.background("#111111");
        if (p5.mouseIsPressed) {
            p5.fill(125);
        } else {
            p5.fill(255);
        }
        p5.ellipse(p5.mouseX, p5.mouseY, 80, 80);
    };
}, 'sungearGui');



















// const VisGene = require('./app/visGene');
//
// function main(args) {
//     try {
//         var i = 0;
//         var warn = true;
//         var plugin = [];
//         var dataDir = null;
//         while (i < args.length && args[i][0] == "-" || args[i] == "demo") {
//             if (args[i].localeCompare("--version")) {
//                 console.log(VisGene.VERSION);
//             } else if (args[i] == "--usage" || args[i] == "--help") {
//                 VisGene.usage();
//             } else if (args[i] == "demo" || args[i] == "-nowarn") {
//                 warn = false;
//                 i++;
//             } else if (args[i] == "-plugin") {
//                 var f = args[i+1].split(",");
//                 for (var s = 0; s < f.length; s++) {
//                     plugin.push(f[s]);
//                 }
//                 i += 2;
//             } else if (args[i] == "-data_dir") {
//                 dataDir = args[i+1];
//                 i += 2;
//             } else {
//                 console.log("ERROR: Unkown argument " + args[i]);
//                 VisGene.usage();
//             }
//         }
//         for (var j = i; j < args.length; j++) {
//             plugin.push(args[j]);
//         }
//         var vis = new VisGene(new URL("./app/"), warn, plugin, dataDir);
//         vis.init();
//     } catch(mu) {
//         alert(mu);
//     }
// }