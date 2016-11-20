"use strict";
/**
 * The Icons class contains p5 drawing instructions for the icons which populate the bottom left-hand corner of the SunGear dialog
 *
 * @author RajahBimmy
 */
const SunValues = require('./sunValues');

/**
 * There should only be two implementations of this object, one for the forward vessel button, and one for the back vessel button.
 *
 * @param type {number} 0 or 2, depending on whether the arrow should point left or right.
 * @param scale {number} Used for sizing the ArrowIcon
 * @param fill {boolean} Whether or not the arrow should be filled or stroked? (change wording) by default.
 * @constructor
 */
function ArrowIcon(type, scale, fill) {
    this.arrowX = [0, 2, 0, 0,-2,-2,0];
    this.arrowY = [2, 0,-2,-1,-1, 1,1];
    this.type = type;
    this.scale = scale;
    this.fill = fill;
    this.selected = false;
    this.contains = false;
}

ArrowIcon.prototype = {
    constructor : ArrowIcon,
    getIconWidth : function() {
        return this.scale * 4;
    },
    getIconHeight : function() {
        return this.scale * 4;
    },
    /**
     * Primary drawing function, called by p5.draw -> SunGear.makeButtons
     *
     * @param p5 {p5} instance for processing
     * @param x {number} x coordinate of ArrowIcon
     * @param y {number} y coordinate of ArrowIcon
     */
    paintIcon : function(p5, x, y) {
        if (typeof y == 'undefined') {
            // If x is passed as an array, just split the values.
            y = x[1];
            x = x[0];
        }
        this.selected = false;
        this.contains = false;
        p5.push();
        p5.translate(x + 2 * this.scale, y + 2 * this.scale);
        p5.rotate(.5 * Math.PI * this.type);
        p5.scale(this.scale, this.scale);
        p5.noStroke();

        if (p5.dist(p5.mouseX, p5.mouseY, x+8, y+8) < this.scale*2) {
            this.contains = true;
            if (p5.mouseIsPressed) {
                p5.fill(SunValues.C_SELECT);
                this.selected = true;
            } else {
                p5.fill(SunValues.C_HIGHLIGHT);
            }
        } else {
            p5.strokeWeight(.25);
            p5.stroke(SunValues.C_PLAIN);
            p5.fill(SunValues.C_BACKGROUND);
        }
        p5.beginShape();
        for (let i = 0; i < this.arrowX.length; i++) {
            p5.vertex(this.arrowX[i], this.arrowY[i]);
        }
        p5.endShape(p5.CLOSE);
        p5.pop();
    }
};
/**
 * The VesselMinIcon is the circle nested inside of another circle in the SunGear dialog. When selected, it should increase or reset the minimum size of vessels.
 *
 * @param steps {number} of different possible sizes (increasing)
 * @param stepSize {number} used for sizing of current inner circle
 * @param step {number} which step we're currently on, from 0 to whatever amount steps is.
 * @constructor
 */
function VesselMinIcon(steps, stepSize, step) {
    this.steps = steps;
    this.stepSize = stepSize;
    this.step = step;
    this.W = 2 * steps * stepSize;
    this.H = this.W;
    this.selected = false;
    this.contains = false;
}

VesselMinIcon.prototype = {
    constructor : VesselMinIcon,
    getIconWidth : function() {
        return this.W;
    },
    getIconHeight : function() {
        return this.H;
    },
    /**
     * Primary drawing function, called by p5.draw -> SunGear.makeButtons
     *
     * @param p5 {p5} instance for processing
     * @param x {number} x coordinate of VesselMinIcon
     * @param y {number} y coordinate of VesselMinIcon
     */
    paintIcon : function(p5, x, y) {
        if (typeof y == 'undefined') {
            // If x is passed as an array, just split the values.
            y = x[1];
            x = x[0];
        }
        this.selected = false;
        this.contains = false;
        p5.push();
        p5.noStroke();
        p5.ellipseMode(p5.CENTER);
        for (var i = this.steps - 1; i >= 0; i--) {
            if (this.step == i) {
                p5.fill(SunValues.C_SELECT);
            } else {
                if (p5.dist(p5.mouseX, p5.mouseY, x, y) < this.stepSize * this.steps) {
                    this.contains = true;
                    p5.fill(SunValues.C_HIGHLIGHT);
                    if (p5.mouseIsPressed) {
                        this.selected = true;
                    }
                } else {
                    p5.fill(SunValues.C_PLAIN);
                }
            }
            const sz = this.stepSize * (i+1) * 2;
            p5.ellipse(x, y, sz, sz);
        }
        p5.pop();
    }
};

/**
 * The ShowArrowIcon sits on the left of the SunGear display, featuring an mini vessel with arrows pointing out in four directions.
 * Back in the SunGear instance, when this is clicked, VesselDisplay's arrows are toggled.
 *
 * @param arrow {boolean}
 * @constructor
 */
function ShowArrowIcon(arrow) {
    this.arrow = arrow;
    this.selected = false;
    this.contains = false;
}

ShowArrowIcon.W = 15;
ShowArrowIcon.H = 15;
ShowArrowIcon.A = 2;

ShowArrowIcon.prototype = {
    constructor : ShowArrowIcon,
    getIconWidth : function() {
        return ShowArrowIcon.W;
    },
    getIconHeight : function() {
        return ShowArrowIcon.H;
    },
    /**
     * Primary drawing function, called by p5.draw -> SunGear.makeButtons
     *
     * @param p5 {p5} instance for processing
     * @param x {number} x coordinate of ShowArrowIcon
     * @param y {number} y coordinate of ShowArrowIcon
     */
    paintIcon : function(p5, x, y) {
        if (typeof y == 'undefined') {
            // If x is passed as an array, just split the values.
            y = x[1];
            x = x[0];
        }
        this.selected = false;
        this.contains = false;
        p5.push();
        // Set color and build oval
        if (p5.dist(p5.mouseX, p5.mouseY, x, y) < 10) {
            this.contains = true;
            if (p5.mouseIsPressed) {
                p5.stroke(SunValues.C_SELECT);
                p5.fill(SunValues.C_SELECT);
                this.selected = true;
            } else {
                p5.stroke(SunValues.C_HIGHLIGHT);
                p5.fill(SunValues.C_HIGHLIGHT);
            }
        } else {
            p5.fill(this.arrow ? SunValues.C_PLAIN_ALT : SunValues.C_PLAIN);
            p5.stroke(this.arrow ? SunValues.C_PLAIN : SunValues.C_PLAIN_ALT);
        }

        p5.push();
        p5.noStroke();
        p5.ellipse(x, y, 7, 7);
        p5.pop();

        p5.translate(x, y);
        for (let i = 0; i < 4; i++) {
            p5.push();
            p5.rotate(i*2*Math.PI/4.0);
            p5.translate(1, -.5);
            p5.line(4, 0, 7, 0);
            p5.line(7, 0, 7-ShowArrowIcon.A, -ShowArrowIcon.A);
            p5.line(7, 0, 7-ShowArrowIcon.A, ShowArrowIcon.A);
            p5.pop();
        }
        p5.pop();
    }
};

/**
 * Circular Icon sitting on bottom of the SunGear Dialog, between two ArrowIcons
 *
 * @param scale {number} for size
 * @param fill {boolean} likely unnecessary?
 * @constructor
 */
function EllipseIcon(scale, fill) {
    this.ellipse = {
        x : -2,
        y : -2,
        w : 4,
        h : 4
    };
    this.scale = scale;
    this.fill = fill;
    this.selected = false;
    this.contains = false;
}

EllipseIcon.prototype = {
    constructor : EllipseIcon,
    getIconWidth : function() {
        return this.scale * 4;
    },
    getIconHeight : function() {
        return this.scale * 4;
    },
    /**
     * Primary drawing function, called by p5.draw -> SunGear.makeButtons
     *
     * @param p5 {p5} instance for processing
     * @param x {number} x coordinate of EllipseIcon
     * @param y {number} y coordinate of EllipseIcon
     */
    paintIcon : function(p5, x, y) {
        if (typeof y == 'undefined') {
            // If x is passed as an array, just split the values.
            y = x[1];
            x = x[0];
        }
        this.contains = false;
        this.selected = false;
        p5.push();
        p5.translate(x+2*this.scale, y+2*this.scale);
        p5.scale(this.scale, this.scale);

        if (p5.dist(p5.mouseX, p5.mouseY, x, y) < 2*this.scale) {
            this.contains = true;
            p5.noStroke();
            if (p5.mouseIsPressed) {
                p5.fill(SunValues.C_SELECT);
                this.selected = true;
            } else {
                p5.fill(SunValues.C_HIGHLIGHT);
            }
        } else {
            p5.strokeWeight(.25);
            p5.stroke(SunValues.C_PLAIN);
            p5.fill(SunValues.C_BACKGROUND);
        }
        p5.ellipse(this.ellipse.x, this.ellipse.y, this.ellipse.w, this.ellipse.h);
        p5.pop();
    }
};

/**
 * Grid on the left hand side of the SunGear Dialog which calls the Stats Frame upon selection.
 * @constructor
 */
function StatsIcon() {
    this.W = 15;
    this.H = 16;
    this.selected = false;
    this.contains = false;
}

StatsIcon.prototype = {
    constructor : StatsIcon,
    getIconWidth : function() {
        return this.W;
    },
    getIconHeight : function() {
        return this.H;
    },
    /**
     * Primary drawing function, called by p5.draw -> SunGear.makeButtons
     *
     * @param p5 {p5} instance for processing
     * @param x {number} x coordinate of StatsIcon
     * @param y {number} y coordinate of StatsIcon
     */
    paintIcon : function(p5, x, y) {
        if (typeof y == 'undefined') {
            // If x is passed as an array, just split the values.
            y = x[1];
            x = x[0];
        }
        this.selected = false;
        this.contains = false;
        p5.push();
        if (p5.dist(p5.mouseX, p5.mouseY, x+(this.W/2), y+(this.H/y)) < this.H) {
            this.contains = true;
            if (p5.mouseIsPressed) {
                p5.stroke(SunValues.C_SELECT);
                this.selected = true;
            } else {
                p5.stroke(SunValues.C_HIGHLIGHT);
            }
        } else {
            p5.stroke(SunValues.C_PLAIN);
        }
        for (let i = 0; i < 3; i++) {
            p5.line(x+7*i, y, x+7*i, y+this.H-1);
        }
        for (let i = 0; i < 6; i++) {
            p5.line(x, y+3*i, x+this.W-1, y+3*i);
        }
        p5.pop();
    }
};

module.exports = {
    ArrowIcon : ArrowIcon,
    VesselMinIcon : VesselMinIcon,
    ShowArrowIcon : ShowArrowIcon,
    EllipseIcon : EllipseIcon,
    StatsIcon : StatsIcon
};
