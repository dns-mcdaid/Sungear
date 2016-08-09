/**
 * @author Dennis McDaid
 */

const DataReader = require('../../data/dataReader');
const SunGear = require('../sungear');


function AnchorDisplay(anchor) {
    this.anchor = anchor;       /** {Anchor} */
    this.highlight = false;
    this.select = false;
    this.showLongDesc = false;  /** True to show long anchor description, false for short */
    this.scale = 1;             /** {double} */
    this.textScale = 1;         /** {double} Scale for text size */
    this.angle = NaN;          /** {double} */

    var s = DataReader.trimAll(this.anchor.name.split(AnchorDisplay.NAME_SEPARATOR));
    this.shortDesc = s[0];      /** {String} Short anchor text for default display */
    this.longDesc = (s.length > 1) ? s[1] : this.shortDesc; /** @type String Long anchor text to display on rollover */
    this.vessels = [];          /** {Vector<VesselDisplay>} */
    this.shape = null;          /** {Shape} */
    this.position = null;       /** {Point2D.Double} */
}

AnchorDisplay.NAME_SEPARATOR = ";";

AnchorDisplay.prototype = {
    constructor : AnchorDisplay,

    cleanup : function() {
        this.anchor.cleanup();
    },
    /** @param s {double} */
    setScale : function(s) {
        this.scale = s;
        if(!isNaN(this.angle)) {
            this.setAngle(this.angle);
        }
    },
    /** @param s {double} */
    setTextScale : function(s) {
        this.textScale = s;
    },
    /**
     * @param theta {double}
     */
    setAngle : function(theta) {
        this.angle = theta;
        this.position = {
            x: SunGear.R_CIRCLE * Math.cos(theta),
            y: SunGear.R_CIRCLE * Math.sin(theta)
        };
    },
    /** @return {double} */
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
    /** @param b {boolean} */
    highlightVessels : function(b) {
        for (var i = 0; i < this.vessels.length; i++) {
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
    /** @param b of type boolean */
    setShowLongDesc : function(b) {
        this.showLongDesc = b;
    },
    /**
     * @returns {boolean}
     */
    isShowLongDesc : function() {
        return this.showLongDesc;
    },
    draw : function(p5) {
        // TODO: Implement lines 79 - 82
        p5.textSize(18);
        p5.textAlign(p5.CENTER);
        p5.textFont("Helvetica");
        var l = this.showLongDesc ? this.longDesc : this.shortDesc;
        p5.push();
    },
    /**
     * @param p of type Point2D.Double
     * @returns {boolean}
     */
    contains : function(p) {
        if (this.shape === null) {
            return false;
        } else {
            var distX = p.x - this.shape.x;
            var distY = p.y - this.shape.y;
            var dist = Math.sqrt((distX*distX) + (distY*distY));
            return (dist < this.shape.w / 2);
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