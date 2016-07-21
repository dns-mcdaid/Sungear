(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */

//var VisGene = require('./app/visGene');

// var jQuery = require('jquery');
//
// require('javascript.util');
// var TreeSet = javascript.util.TreeSet;
//
// function Band(name, rank) {
//     this.name = name;
//     this.rank = rank;
// }
//
// Band.prototype.compareTo = function(b) {
//     if (this.rank > b.rank) {
//         return 1;
//     } else if (this.rank < b.rank) {
//         return -1;
//     }
//     return 0;
// };
//
// var myTree = new TreeSet();
// var myArray = [];
// var bandName = [ "The Killers", "Muse", "The Rolling Stones", "Radiohead", "The Beatles"];
//
// for (var i = 0; i < bandName.length; i++) {
//     var band1 = new Band(bandName[i], i+1);
//     myArray.push(band1);
// }
//
// console.log(JSON.stringify(myArray));
//
// for (var j = 0; j < myArray.length; j++) {
//     myTree.add(jQuery.extend({}, myArray[j]));
// }
//
// console.log(JSON.stringify(myTree));
//
// var x = myTree.toArray();
//
// x[3].name = "CHEEKY";
//
// console.log(JSON.stringify(myArray));
// console.log(JSON.stringify(myTree.size()));
// console.log(JSON.stringify(x));
// console.log(myTree.contains(band1));

// var potato = {
//     x : null,
//     y : null
// };
//
// var tomato = {
//     x : 15,
//     y : 10
// };
//
// potato = tomato;
// tomato = null;
// console.log(potato);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRlbm5pc21jZGFpZCBvbiA3LzEwLzE2LlxuICovXG4vKipcbiAqIEJFRk9SRSBSVU5OSU5HOlxuICogTmF2aWdhdGUgdG8gdGhlIG92ZXJhcmNoaW5nIFN1bmdlYXIgZm9sZGVyLCB0aGVuIHJ1bjpcbiAqIGJyb3dzZXJpZnkgcHVibGljL2phdmFzY3JpcHRzL21haW4uanMgLW8gcHVibGljL2phdmFzY3JpcHRzL291dC5qcyAtZFxuICovXG5cbi8vdmFyIFZpc0dlbmUgPSByZXF1aXJlKCcuL2FwcC92aXNHZW5lJyk7XG5cbi8vIHZhciBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbi8vXG4vLyByZXF1aXJlKCdqYXZhc2NyaXB0LnV0aWwnKTtcbi8vIHZhciBUcmVlU2V0ID0gamF2YXNjcmlwdC51dGlsLlRyZWVTZXQ7XG4vL1xuLy8gZnVuY3Rpb24gQmFuZChuYW1lLCByYW5rKSB7XG4vLyAgICAgdGhpcy5uYW1lID0gbmFtZTtcbi8vICAgICB0aGlzLnJhbmsgPSByYW5rO1xuLy8gfVxuLy9cbi8vIEJhbmQucHJvdG90eXBlLmNvbXBhcmVUbyA9IGZ1bmN0aW9uKGIpIHtcbi8vICAgICBpZiAodGhpcy5yYW5rID4gYi5yYW5rKSB7XG4vLyAgICAgICAgIHJldHVybiAxO1xuLy8gICAgIH0gZWxzZSBpZiAodGhpcy5yYW5rIDwgYi5yYW5rKSB7XG4vLyAgICAgICAgIHJldHVybiAtMTtcbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIDA7XG4vLyB9O1xuLy9cbi8vIHZhciBteVRyZWUgPSBuZXcgVHJlZVNldCgpO1xuLy8gdmFyIG15QXJyYXkgPSBbXTtcbi8vIHZhciBiYW5kTmFtZSA9IFsgXCJUaGUgS2lsbGVyc1wiLCBcIk11c2VcIiwgXCJUaGUgUm9sbGluZyBTdG9uZXNcIiwgXCJSYWRpb2hlYWRcIiwgXCJUaGUgQmVhdGxlc1wiXTtcbi8vXG4vLyBmb3IgKHZhciBpID0gMDsgaSA8IGJhbmROYW1lLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgdmFyIGJhbmQxID0gbmV3IEJhbmQoYmFuZE5hbWVbaV0sIGkrMSk7XG4vLyAgICAgbXlBcnJheS5wdXNoKGJhbmQxKTtcbi8vIH1cbi8vXG4vLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShteUFycmF5KSk7XG4vL1xuLy8gZm9yICh2YXIgaiA9IDA7IGogPCBteUFycmF5Lmxlbmd0aDsgaisrKSB7XG4vLyAgICAgbXlUcmVlLmFkZChqUXVlcnkuZXh0ZW5kKHt9LCBteUFycmF5W2pdKSk7XG4vLyB9XG4vL1xuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobXlUcmVlKSk7XG4vL1xuLy8gdmFyIHggPSBteVRyZWUudG9BcnJheSgpO1xuLy9cbi8vIHhbM10ubmFtZSA9IFwiQ0hFRUtZXCI7XG4vL1xuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobXlBcnJheSkpO1xuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobXlUcmVlLnNpemUoKSkpO1xuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeCkpO1xuLy8gY29uc29sZS5sb2cobXlUcmVlLmNvbnRhaW5zKGJhbmQxKSk7XG5cbi8vIHZhciBwb3RhdG8gPSB7XG4vLyAgICAgeCA6IG51bGwsXG4vLyAgICAgeSA6IG51bGxcbi8vIH07XG4vL1xuLy8gdmFyIHRvbWF0byA9IHtcbi8vICAgICB4IDogMTUsXG4vLyAgICAgeSA6IDEwXG4vLyB9O1xuLy9cbi8vIHBvdGF0byA9IHRvbWF0bztcbi8vIHRvbWF0byA9IG51bGw7XG4vLyBjb25zb2xlLmxvZyhwb3RhdG8pO1xuIl19
