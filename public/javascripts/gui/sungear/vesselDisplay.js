"use strict";

const SortedSet = require('collections/sorted-set');

function VesselDisplay(vessel) {
    this.vessel = vessel;
    this.highlight = false;
    this.select = false;
    this.start = {
        x : null, y : null
    };
    this.center = {
        x : null, y : null
    };
    this.activeGenes = new SortedSet();
    this.selectedGenes = new SortedSet();
    this.radMax = 0.1;
    this.radMin = 0.0;
    this.showArrows = true;
    this.shape = {
        x : null, y : null,
        w : null, h : null
    };
    this.selectedShape = {
        x : null, y : null,
        w : null, h : null
    };

    this.debug = true;
}

VesselDisplay.ARROW_LINE = 0.7;
VesselDisplay.ARROW_END = 0.2;

VesselDisplay.R_OUTER = 1.2;
VesselDisplay.R_CIRCLE = 1.0;
VesselDisplay.C_PLAIN = "#F3EFE0";
VesselDisplay.C_HIGHLIGHT = "#3399FF";
VesselDisplay.C_SELECT = "#9A3334";
VesselDisplay.C_BACKGROUND = "#111111";
VesselDisplay.C_SELECT_ALT = "#217C7E";

VesselDisplay.prototype = {
    constructor : VesselDisplay,
    cleanup : function() {
        this.activeGenes.clear();
        this.selectedGenes.clear();
    },
    /**
     * @param conv {Map} Hash table mapping Anchor to AnchorDisplay
     */
    setAnchors : function(conv) {
        this.anchor = [];
        for (let i = 0; i < this.vessel.anchor.length; i++) {
            this.anchor[i] = conv.get(this.vessel.anchor[i]);
            this.anchor[i].vessels.push(this);
        }
    },
    /**
     * @param vMax {Number} double
     */
    setMax : function(vMax) {
        this.vMax = vMax;
    },
    /**
     * @param rMax {Number} double
     */
    setRadMax : function(rMax) {
        this.radMax = rMax;
    },
    /**
     * @param rMin {Number} double
     */
    setRadMin : function(rMin) {
        this.radMin = rMin;
    },
    getRadOuter : function() {
        return this.radOuter;
    },
    /**
     * @param b {boolean}
     */
    setShowArrows : function(b) {
        this.showArrows = b;
    },
    getFullRad : function() {
        return this.radOuter * (1.0 + (this.showArrows ? VesselDisplay.ARROW_LINE : 0.0));
    },
    clearSelectedGenes : function() {
        this.selectedGenes.clear();
        this.updateSize();
    },
    selectAllGenes : function() {
        this.selectedGenes.clear();
        this.selectedGenes = this.selectedGenes.union(this.activeGenes.toArray());
        this.updateSize();
    },
    setSelectedGenes : function(sel) {
        this.selectedGenes.clear();
        this.selectedGenes = this.selectedGenes.union(this.activeGenes.toArray());
        this.selectedGenes = this.selectedGenes.intersection(sel.toArray());
        this.updateSize();
    },
    getSelectedCount : function() {
        return this.selectedGenes.length;
    },
    initActive : function() {
        this.activeGenes = this.activeGenes.union(this.vessel.genes.toArray());
    },
    setActiveGenes : function(sel) {
        this.activeGenes.clear();
        this.activeGenes = this.activeGenes.union(this.vessel.genes.toArray());
        this.activeGenes = this.activeGenes.intersection(sel.toArray());
    },
    getActiveCount : function() {
        return this.activeGenes.length;
    },
    makeShape : function(rad_inner) {
        if (this.start === null || this.start.x === null) {
            let p = {
                x : 0,
                y : 0
            };
            if (this.anchor.length == 0) {
                p.x = -(VesselDisplay.R_CIRCLE);
                p.y = -(VesselDisplay.R_CIRCLE)+0.15;
            } else {
                for (let i = 0; i < this.anchor.length; i++) {
                    const theta = this.anchor[i].angle;
                    p.x += rad_inner * Math.cos(theta) / this.anchor.length;
                    p.y += rad_inner * Math.sin(theta) / this.anchor.length;
                }
            }
            this.start.x = p.x;
            this.start.y = p.y;
            this.setCenter(p.x, p.y, rad_inner);
            this.selectAllGenes();
        }
        // area 0 - vMax ==> 0 - 0.1
        this.radOuter = this.getShapeRad(this.getActiveCount(), this.vMax);
        this.shape = {
            x : this.center.x-this.radOuter,
            y : this.center.y-this.radOuter,
            w : this.radOuter*2,
            h : this.radOuter*2
        };
    },
    updateSize : function() {
        this.radInner = this.getShapeRad(this.getSelectedCount(), this.vMax);
        this.selectedShape = {
            x : this.center.x-this.radInner,
            y : this.center.y-this.radInner,
            w : this.radInner*2,
            h : this.radInner*2
        };
    },
    updateCenter : function() {
        this.setCenter(this.center.x, this.center.y, this.radInner);
    },
    setCenter : function(x, y, rad_inner) {
        // Necessary for the 2 parameter constructor
        if (typeof rad_inner === 'undefined') {
            rad_inner = y;
            y = x.y;
            x = x.x;
        }
        this.center = {
            x : x,
            y : y
        };
        this.angle = [];
        for (let i = 0; i < this.anchor.length; i++) {
            const a = this.anchor[i];
            const dx = a.position.x - this.center.x;
            const dy = a.position.y - this.center.y;
            const r = Math.sqrt(dx*dx + dy*dy);
            const theta = Math.acos(dx/r);
            this.angle[i] = (dy > 0) ? theta : -theta;
        }
        this.makeShape(rad_inner);
        this.updateSize();
    },
    getCenter : function() {
        return this.center;
    },
    getStart : function() {
        return this.start;
    },
    getShapeRad : function(count, vMax) {
        return this.radMin + Math.sqrt(count/vMax)*(this.radMax-this.radMin);
    },
    contains : function(p, p5) {
        // TODO: Make sure this works.
        return p5.dist(p.x,p.y,this.shape.x,this.shape.y) < (this.shape.width / 2);
    },
    setHighlight : function(b) {
        this.highlight = b;
    },
    getHighlight : function() {
        return this.highlight;
    },
    setSelect : function(b) {
        this.select = b;
    },
    getSelect : function() {
        return this.select;
    },
    highlightAnchors : function(b) {
        for (let i = 0; i < this.anchor.length; i++) {
            this.anchor[i].setHighlight(b);
        }
    },
    draw : function(p5) {
        if (this.getActiveCount() == 0) return;

        if (this.debug) {
            console.log(this.shape.h);
            console.log("inner " + this.radInner);
            console.log("outer " + this.radOuter);
            console.log((p5.width/2.0 + this.shape.x) + ", " + (p5.height/2.0 + this.shape.y));
            this.debug = false;
        }

        p5.strokeWeight(.005);
        p5.ellipseMode(p5.CORNER);
        let color = VesselDisplay.C_PLAIN;
        if (p5.dist((p5.width/2.0 + this.shape.x), (p5.height/2.0 + this.shape.y), p5.mouseX, p5.mouseY) < this.shape.h) {
            if (p5.mouseIsPressed) {
                color = VesselDisplay.C_HIGHLIGHT;
            } else {
                color = VesselDisplay.C_SELECT;
            }
        }
        color = (this.select ? VesselDisplay.C_SELECT : (this.highlight ? VesselDisplay.C_HIGHLIGHT : color));
        p5.stroke(color);
        // if (this.getSelectedCount() == 0 && color == VesselDisplay.C_PLAIN) {
        //     p5.fill('#D1CDB8');
        // }
        if (this.getSelectedCount() > 0) {
            p5.fill(color);
        }
        p5.ellipse(this.shape.x,this.shape.y,this.shape.h,this.shape.w);
        if (this.showArrows) {
            for (let i = 0; i < this.angle.length; i++) {
                this.drawArrow(p5, this.angle[i]);
            }
        }
    },
    drawArrow : function(p5, theta) {
        p5.push();
        p5.translate(this.center.x, this.center.y);
        p5.scale(this.radOuter, this.radOuter);
        p5.rotate(theta);
        const w = 0.05 * this.radMax / this.radOuter;
        p5.strokeWeight(w);
        p5.line(1.0, 0, 1.0 + VesselDisplay.ARROW_LINE, 0);
        p5.line(1.0 + VesselDisplay.ARROW_LINE, 0, 1.0 + VesselDisplay.ARROW_LINE - VesselDisplay.ARROW_END, VesselDisplay.ARROW_END);
        p5.line(1.0 + VesselDisplay.ARROW_LINE, 0, 1.0 + VesselDisplay.ARROW_LINE - VesselDisplay.ARROW_END, -(VesselDisplay.ARROW_END));
        p5.pop();
    }
};

module.exports = VesselDisplay;