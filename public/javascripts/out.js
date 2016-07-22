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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgZGVubmlzbWNkYWlkIG9uIDcvMTAvMTYuXHJcbiAqL1xyXG4vKipcclxuICogQkVGT1JFIFJVTk5JTkc6XHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBvdmVyYXJjaGluZyBTdW5nZWFyIGZvbGRlciwgdGhlbiBydW46XHJcbiAqIGJyb3dzZXJpZnkgcHVibGljL2phdmFzY3JpcHRzL21haW4uanMgLW8gcHVibGljL2phdmFzY3JpcHRzL291dC5qcyAtZFxyXG4gKi9cclxuXHJcbi8vdmFyIFZpc0dlbmUgPSByZXF1aXJlKCcuL2FwcC92aXNHZW5lJyk7XHJcblxyXG4vLyB2YXIgalF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbi8vXHJcbi8vIHJlcXVpcmUoJ2phdmFzY3JpcHQudXRpbCcpO1xyXG4vLyB2YXIgVHJlZVNldCA9IGphdmFzY3JpcHQudXRpbC5UcmVlU2V0O1xyXG4vL1xyXG4vLyBmdW5jdGlvbiBCYW5kKG5hbWUsIHJhbmspIHtcclxuLy8gICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbi8vICAgICB0aGlzLnJhbmsgPSByYW5rO1xyXG4vLyB9XHJcbi8vXHJcbi8vIEJhbmQucHJvdG90eXBlLmNvbXBhcmVUbyA9IGZ1bmN0aW9uKGIpIHtcclxuLy8gICAgIGlmICh0aGlzLnJhbmsgPiBiLnJhbmspIHtcclxuLy8gICAgICAgICByZXR1cm4gMTtcclxuLy8gICAgIH0gZWxzZSBpZiAodGhpcy5yYW5rIDwgYi5yYW5rKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIC0xO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgcmV0dXJuIDA7XHJcbi8vIH07XHJcbi8vXHJcbi8vIHZhciBteVRyZWUgPSBuZXcgVHJlZVNldCgpO1xyXG4vLyB2YXIgbXlBcnJheSA9IFtdO1xyXG4vLyB2YXIgYmFuZE5hbWUgPSBbIFwiVGhlIEtpbGxlcnNcIiwgXCJNdXNlXCIsIFwiVGhlIFJvbGxpbmcgU3RvbmVzXCIsIFwiUmFkaW9oZWFkXCIsIFwiVGhlIEJlYXRsZXNcIl07XHJcbi8vXHJcbi8vIGZvciAodmFyIGkgPSAwOyBpIDwgYmFuZE5hbWUubGVuZ3RoOyBpKyspIHtcclxuLy8gICAgIHZhciBiYW5kMSA9IG5ldyBCYW5kKGJhbmROYW1lW2ldLCBpKzEpO1xyXG4vLyAgICAgbXlBcnJheS5wdXNoKGJhbmQxKTtcclxuLy8gfVxyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShteUFycmF5KSk7XHJcbi8vXHJcbi8vIGZvciAodmFyIGogPSAwOyBqIDwgbXlBcnJheS5sZW5ndGg7IGorKykge1xyXG4vLyAgICAgbXlUcmVlLmFkZChqUXVlcnkuZXh0ZW5kKHt9LCBteUFycmF5W2pdKSk7XHJcbi8vIH1cclxuLy9cclxuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobXlUcmVlKSk7XHJcbi8vXHJcbi8vIHZhciB4ID0gbXlUcmVlLnRvQXJyYXkoKTtcclxuLy9cclxuLy8geFszXS5uYW1lID0gXCJDSEVFS1lcIjtcclxuLy9cclxuLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkobXlBcnJheSkpO1xyXG4vLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShteVRyZWUuc2l6ZSgpKSk7XHJcbi8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHgpKTtcclxuLy8gY29uc29sZS5sb2cobXlUcmVlLmNvbnRhaW5zKGJhbmQxKSk7XHJcblxyXG4vLyB2YXIgcG90YXRvID0ge1xyXG4vLyAgICAgeCA6IG51bGwsXHJcbi8vICAgICB5IDogbnVsbFxyXG4vLyB9O1xyXG4vL1xyXG4vLyB2YXIgdG9tYXRvID0ge1xyXG4vLyAgICAgeCA6IDE1LFxyXG4vLyAgICAgeSA6IDEwXHJcbi8vIH07XHJcbi8vXHJcbi8vIHBvdGF0byA9IHRvbWF0bztcclxuLy8gdG9tYXRvID0gbnVsbDtcclxuLy8gY29uc29sZS5sb2cocG90YXRvKTtcclxuIl19
