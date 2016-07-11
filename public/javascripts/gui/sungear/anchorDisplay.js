/**
 * @author Dennis McDaid
 */

var Sungear = require('../sungear');
var DataReader = require('../../data/dataReader');

function AnchorDisplay(anchor) {
    this.anchor = anchor;       /** @type Anchor */
    this.highlight = false;
    this.select = false;
    this.showLongDesc = false;  /** True to show long anchor description, false for short */
    this.scale = 1;             /** @type double */
    this.textScale = 1;         /** @type double Scale for text size */
    this.angle = null;          /** @type double */

    // TODO: @Dennis Make sure this works
    var s = new DataReader().trimAll(this.anchor.name.split(this.NAME_SEPARATOR));
    this.shortDesc = s[0];      /** @type String Short anchor text for default display */
    this.longDesc = (s.length > 1) ? s[1] : this.shortDesc; /** @type String Long anchor text to display on rollover */
    this.vessels = [];          /** @type Vector<VesselDisplay> */
    this.shape = null;          /** @type Shape */
    this.position = null;       /** @type Point2D.Double */
}

AnchorDisplay.NAME_SEPARATOR = ";";

AnchorDisplay.prototype = {
    constructor : AnchorDisplay,

    cleanup : function() {
        this.anchor.cleanup();
    },
    /** @param s of type double */
    setScale : function(s) {
        this.scale = s;
        if(this.angle != null) {
            this.setAngle(this.angle);
        }
    },
    /** @param s of type double */
    setTextScale : function(s) {
        this.textScale = s;
    },
    /**
     * @param theta of type double
     * @param p5 MUST BE PASSED
     */
    setAngle : function(theta, p5) {
        this.angle = theta;
        this.position = p5.point(Sungear.R_CIRCLE*Math.cos(theta), Sungear.R_CIRCLE*Math.sin(theta));
    },
    getAngle : function() {
        return this.angle;
    },
    /** @param b of type boolean */
    setHighlight : function(b) {
        this.highlight = b;
    },
    getHighlight : function() {
        return this.highlight;
    },
    /** @param b of type boolean */
    highlightVessels : function(b) {
        for (var i = 0; i < this.vessels.length; i++) {
            this.vessels[i].setHighlight(b);
        }
    },
    /** @param b of type boolean */
    setSelect : function(b) {
        this.select = b;
    },
    getSelect : function() {
        return this.select;
    },
    /** @param b of type boolean */
    setShowLongDesc : function(b) {
        this.showLongDesc = b;
    },
    isShowLongDesc : function() {
        return this.showLongDesc;
    },
    draw : function(p5) {
        // TODO: @Dennis figure out AffineTransform and Implement
    },
    /**
     * @param p of type Point2D.Double
     * @param p5 MUST BE PASSED
     * @returns {boolean}
     */
    contains : function(p, p5) {
        return this.shape === null ? false : (p5.dist(p.x,p.y,this.shape.x,this.shape.y) < (this.shape.width / 2));
    },
    /**
     * @param a {AnchorDisplay}
     * @returns {boolean}
     */
    compareTo : function(a) {
        return this.anchor.compareTo(a.anchor);
    }
};