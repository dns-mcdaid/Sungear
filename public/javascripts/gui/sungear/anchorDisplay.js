"use strict";
/**
 * AnchorDisplay objects are short titles fixed on each corner of the gear's main outer shape (or just top and bottom if the gear is a circle).
 * There should be one AnchorDisplay to each Anchor (and one Anchor to each Gene Set).
 *
 * @mvc View
 * @author RajahBimmy
 */

const DataReader = require('../../data/dataReader');
const SunValues = require('./sunValues');

function AnchorDisplay(anchor) {
    this.anchor = anchor;       /** {Anchor} 1 to 1 relationship */
    this.highlight = false;
    this.select = false;
    this.showLongDesc = false;  /** {boolean} True to show long anchor description, false for short */
    this._scale = 1;            /** {number} double */
    // this.textScale = 1;         /** {Number} double Scale for text size. Possibly unused? */
    this.angle = NaN;          /** {number} Angling of AnchorDisplay relative to Gear's main component */

    const s = DataReader.trimAll(this.anchor.name.split(AnchorDisplay.NAME_SEPARATOR));
    this.shortDesc = s[0];      /** {string} Short anchor text for default display */
    this.longDesc = (s.length > 1) ? s[1] : this.shortDesc; /** {string} Long anchor text to display on rollover */
    this.vessels = [];          /** {Array} of VesselDisplays */
    this._shape = null;          /** {Shape} */
    this.position = {};       /** {object with x and y coordinates} */
    this.contains = false;
    this.debug = false;
}

AnchorDisplay.NAME_SEPARATOR = ";";

AnchorDisplay.prototype = {
    constructor : AnchorDisplay,

    cleanup : function() {
        this.anchor.cleanup();
    },
    /** @param s {number} double */
    setScale : function(s) {
        this._scale = s;
        if(!isNaN(this.angle)) {
            this.setAngle(this.angle);
        }
    },
    /** @function setTextScale was removed */
    /**
     * This function should be called on each unique AnchorDisplay to offset their angles from the gear's center.
     * Likely calling function is SunValues.makeDisplay
     *
     * @param theta {Number} double
     */
    setAngle : function(theta) {
        this.angle = theta;
        this.position.x = SunValues.R_CIRCLE * Math.cos(theta);
        this.position.y = SunValues.R_CIRCLE * Math.sin(theta);
    },
    /** @return {Number} double */
    getAngle : function() {
        return this.angle;
    },
    /** @param b {boolean} */
    setHighlight : function(b) {
        this.highlight = b;
    },
    /** @return {boolean} */
    getHighlight : function() {
        return this.highlight;
    },
    /**
     * This function either highlights or removes the highlight from each individual vessel.
     *
     * @param b {boolean}
     */
    highlightVessels : function(b) {
        for (let i = 0; i < this.vessels.length; i++) {
            this.vessels[i].setHighlight(b);
        }
    },
    /** @param b {boolean} */
    setSelect : function(b) {
        this.select = b;
    },
    /**
     * @returns {boolean}
     */
    getSelect : function() {
        return this.select;
    },
    /** @param b {boolean} */
    setShowLongDesc : function(b) {
        this.showLongDesc = b;
    },
    /**
     * @returns {boolean}
     */
    isShowLongDesc : function() {
        return this.showLongDesc;
    },
    /**
     * Principle drawing function used in the p5.draw loop
     * Likely called by SunValues.paintComponent
     *
     * @param p5 {p5} processing library
     * @param drawT {Object} Coordinates to use as basis.
     */
    draw : function(p5, drawT) {
        const tx = drawT.x;
        const ty = drawT.y;
        const tm = Math.min(tx, ty);
        const scale = drawT.scale / 192.91666666666669;
        const off = 34*scale;

        p5.push();
        p5.textSize(18);
        //noinspection JSCheckFunctionSignatures
        p5.textAlign(p5.CENTER);
        p5.textFont("Helvetica");

        const l = this.showLongDesc ? this.longDesc : this.shortDesc;

        const location = this.findAnchorCorner(tx, ty, tm, off);

        p5.translate(tx, ty);
        p5.rotate(this.angle);
        p5.translate(off + tm/1.2, 0);
        p5.rotate(this.angle < Math.PI ? -Math.PI/2.0 : Math.PI/2.0);
        p5.translate(-0.5, 7*scale);

        let color = SunValues.C_PLAIN;
        color = (this.select ? SunValues.C_SELECT : (this.highlight ? SunValues.C_HIGHLIGHT : color));
        if (p5.dist(p5.mouseX, p5.mouseY, location.x, location.y) < l.length) {
            if (p5.mouseIsPressed) {
                color = SunValues.C_SELECT;
            } else {
                color = SunValues.C_HIGHLIGHT;
            }
            this.contains = true;
        } else {
            this.contains = false;
        }
        p5.fill(color);
        p5.text(l, 0, 0);
        p5.pop();
        // TODO: Make shape around AnchorDisplay text?
    },
    /**
     * Finds the corner point of an Anchor
     *
     * @param tx {number} Center X of Gear
     * @param ty {number} Center Y of Gear
     * @param tm {number} Minimum between tx and ty
     * @param off {number} offset
     * @returns {{x: number, y: number}}
     */
    findAnchorCorner : function(tx, ty, tm, off) {
        const rotation = this.getRotation(tx, ty, (off + tm/1.2), ty, this.angle);
        const newScale = (0.5*Math.min(tx, ty)/SunValues.R_OUTER);
        let x = rotation[0];
        let y = rotation[1];
        x += (x == tx ? 0 : (x > tx ? newScale : -newScale));
        y += (y == ty ? 0 : (y > ty ? newScale : -newScale));
        return {
            x : x,
            y : y
        };
    },
    /**
     * This function takes in a center point, x-y point, and angle, then returns an array of the x-y point rotated on the center axis.
     *
     * @param cx {number} Center X
     * @param cy {number} Center Y
     * @param x {number} Point X
     * @param y {number} Point Y
     * @param angle {number} Rotation Angle
     * @returns {Array} New X and Y coordinates
     */
    getRotation : function(cx, cy, x, y, angle) {
        const radians = angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        returnY = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        let tempX = nx - cx;
        let returnX = cx - tempX;
        return [returnX, returnY];
    },
    /** @function contains was removed */
    /**
     * @param a {AnchorDisplay}
     * @returns {boolean}
     */
    compareTo : function(a) {
        return this.anchor.compareTo(a.anchor);
    }
};

module.exports = AnchorDisplay;