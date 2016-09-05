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
    this._scale = 1;            /** {Number} double */
    // this.textScale = 1;         /** {Number} double Scale for text size. Possibly unused? */
    this.angle = NaN;          /** {Number} Angling of AnchorDisplay relative to Gear's main component */

    const s = DataReader.trimAll(this.anchor.name.split(AnchorDisplay.NAME_SEPARATOR));
    this.shortDesc = s[0];      /** {String} Short anchor text for default display */
    this.longDesc = (s.length > 1) ? s[1] : this.shortDesc; /** @type String Long anchor text to display on rollover */
    this.vessels = [];          /** {Vector<VesselDisplay>} */
    this._shape = null;          /** {Shape} */
    this.position = {};       /** {Point2D.Double} */
    this.debug = true;
}

AnchorDisplay.NAME_SEPARATOR = ";";

AnchorDisplay.prototype = {
    constructor : AnchorDisplay,

    cleanup : function() {
        this.anchor.cleanup();
    },
    /** @param s {Number} double */
    setScale : function(s) {
        this._scale = s;
        if(!isNaN(this.angle)) {
            this.setAngle(this.angle);
        }
    },
    // /** @param s {double} */
    // setTextScale : function(s) {
    //     this.textScale = s;
    // },
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

        // if (this.debug) {
        //     this.debug = false;
        //     console.log(l);
        //     console.log(tx);
        //     console.log(ty);
        //     console.log((off + tm/1.2));
        //     console.log(this.angle);
        // }
        // let ratio = tx / ty;
        // if (ratio < 1.6) {
        //     ratio *= 9;
        // } else if (ratio > 1.7) {
        //     ratio = 1.1;
        // }

        // let getRotation = rotate(tx, ty, (off + (tm/ratio)), ty, this.angle);
        // let x = getRotation[0];
        // let tempX = x - tx;
        // x = tx - tempX;
        // let y = getRotation[1];

        // DEBUGGING PURPOSES ONLY:
        // p5.fill(SunValues.C_PLAIN);
        // p5.ellipse(x, y, 10, 10);

        p5.translate(tx, ty);
        p5.rotate(this.angle);
        p5.translate(off + tm/1.2, 0);
        p5.rotate(this.angle < Math.PI ? -Math.PI/2.0 : Math.PI/2.0);
        p5.translate(-0.5, 7*scale);


        // if (p5.dist(p5.mouseX, p5.mouseY, x, y) < scale*20) {
        //     if (p5.mouseIsPressed) {
        //         this.select = true;
        //         this.highlight = false;
        //     } else {
        //         this.highlight = true;
        //         this.select = false;
        //     }
        // } else {
        //     // TODO: maybe set highlight to false?
        // }
        p5.fill(this.select ? SunValues.C_SELECT : (this.highlight ? SunValues.C_HIGHLIGHT : SunValues.C_PLAIN));
        p5.text(l, 0, 0);
        p5.pop();
        // TODO: Continue implementation.
    },
    /**
     * @param p of type Point2D.Double
     * @returns {boolean}
     */
    contains : function(p) {
        if (this._shape === null) {
            return false;
        } else {
            var distX = p.x - this._shape.x;
            var distY = p.y - this._shape.y;
            var dist = Math.sqrt((distX*distX) + (distY*distY));
            return (dist < this._shape.w / 2);
        }
    },
    /**
     * @param a {AnchorDisplay}
     * @returns {boolean}
     */
    compareTo : function(a) {
        return this.anchor.compareTo(a.anchor);
    }
};

// function rotate(cx, cy, x, y, angle) {
//     var radians = angle,
//         cos = Math.cos(radians),
//         sin = Math.sin(radians),
//         nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
//         ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
//     return [nx, ny];
// }

module.exports = AnchorDisplay;