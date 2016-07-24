(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by dennismcdaid on 7/10/16.
 */
/**
 * BEFORE RUNNING:
 * Navigate to the overarching Sungear folder, then run:
 * browserify public/javascripts/main.js -o public/javascripts/out.js -d
 */
function Plant(year, type) {
    this.year = year;
    this.type = type;
    this.contents = new Potato("Red");
}


function Potato(name) {
    this.name = name;
}

Potato.prototype.fuckWithMe = function(parent) {
    parent.year = 1969;
};


var x = new Plant(2016, "tree");

console.log(x.year);

x.contents.fuckWithMe(x);
console.log(x.year);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGRlbm5pc21jZGFpZCBvbiA3LzEwLzE2LlxuICovXG4vKipcbiAqIEJFRk9SRSBSVU5OSU5HOlxuICogTmF2aWdhdGUgdG8gdGhlIG92ZXJhcmNoaW5nIFN1bmdlYXIgZm9sZGVyLCB0aGVuIHJ1bjpcbiAqIGJyb3dzZXJpZnkgcHVibGljL2phdmFzY3JpcHRzL21haW4uanMgLW8gcHVibGljL2phdmFzY3JpcHRzL291dC5qcyAtZFxuICovXG5cbmZ1bmN0aW9uIFBsYW50KHllYXIsIHR5cGUpIHtcbiAgICB0aGlzLnllYXIgPSB5ZWFyO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5jb250ZW50cyA9IG5ldyBQb3RhdG8oXCJSZWRcIik7XG59XG5cblxuZnVuY3Rpb24gUG90YXRvKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xufVxuXG5Qb3RhdG8ucHJvdG90eXBlLmZ1Y2tXaXRoTWUgPSBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICBwYXJlbnQueWVhciA9IDE5Njk7XG59O1xuXG52YXIgeCA9IG5ldyBQbGFudCgyMDE2LCBcInRyZWVcIik7XG5cbmNvbnNvbGUubG9nKHgueWVhcik7XG5cbnguY29udGVudHMuZnVja1dpdGhNZSh4KTtcblxuY29uc29sZS5sb2coeC55ZWFyKTsiXX0=
