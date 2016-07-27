require('javascript.util');
var TreeSet = javascript.util.TreeSet;

var SunGear = require('../sunGear');

function VesselDisplay(vessel) {
    this.vessel = vessel;
    this.highlight = false;
    this.select = false;
    this.start = {
        x : null,
        y : null
    };
    this.center = {
        x : null,
        y : null
    };
    this.activeGenes = new TreeSet();
    this.selectedGenes = new TreeSet();
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
}

VesselDisplay.ARROW_LINE = 0.7;
VesselDisplay.ARROW_END = 0.2;

VesselDisplay.prototype = {
    constructor : VesselDisplay,
    cleanup : function() {
        this.activeGenes = new TreeSet();
        this.selectedGenes = new TreeSet();
    },
    /**
     * @param conv {Hashtable<Anchor,AnchorDisplay>}
     */
    setAnchors : function(conv) {
        this.anchor = [];
        for (var i = 0; i < this.anchor.length; i++) {
            this.anchor[i] = conv[this.vessel.anchor[i]];
            this.anchor[i].vessels.push(this);
        }
    },
    /**
     * @param vMax {double}
     */
    setMax : function(vMax) {
        this.vMax = vMax;
    },
    /**
     * @param rMax {double}
     */
    setRadMax : function(rMax) {
        this.radMax = rMax;
    },
    /**
     * @param rMin {double}
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
        this.selectedGenes = new TreeSet();
        this.updateSize();
    },
    selectAllGenes : function() {
        this.selectedGenes = new TreeSet();
        var temp = this.activeGenes.toArray();
        for (var i = 0; i < temp.length; i++) {
            this.selectedGenes.add(temp[i]);
        }
        this.updateSize();
    },
    setSelectedGenes : function(sel) {
        var incoming = sel.toArray();
        for (var i = 0; i < incoming.length; i++) {
            if (this.activeGenes.contains(incoming[i])) {
                this.selectedGenes.add(incoming[i]);
            }
        }
        this.updateSize();
    },
    getSelectedCount : function() {
        return this.selectedGenes.size();
    },
    initActive : function() {
        var temp = this.vessel.genes.toArray();
        for (var i = 0; i < temp.length; i++) {
            this.activeGenes.add(temp[i]);
        }
    },
    setActiveGenes : function(sel) {
        var incoming = sel.toArray();
        for (var i = 0; i < incoming.length; i++) {
            if (this.vessel.genes.contains(incoming[i])) {
                this.activeGenes.add(incoming[i]);
            }
        }
    },
    getActiveCount : function() {
        return this.activeGenes.size();
    },
    makeShape : function(rad_inner) {
        if (this.start === null) {
            var p = {
                x : null,
                y : null
            };
            if (this.anchor.length == 0) {
                p.x = (-(SunGear.R_CIRCLE), -(SunGear.R_CIRCLE+0.15));
            } else {
                for (var i = 0; i < this.anchor.length; i++) {
                    var theta = this.anchor.angle;
                    p.x += rad_inner * Math.cos(theta) / this.anchor.length;
                    p.y += rad_inner * Math.sin(theta) / this.anchor.length;
                }
            }
            this.start = p;
            this.setCenter(p, rad_inner);
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
        this.setCenter(this.center, this.radInner);
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
        var angleSize = this.anchor.length;
        for (var i = 0; i < angleSize; i++) {
            var a = this.anchor[i];
            var dx = a.position.x - this.center.x;
            var dy = a.position.y - this.center.y;
            var r = Math.sqrt(dx*dx + dy*dy);
            var theta = Math.acos(dx/r);
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
        for (var i = 0; i < this.anchor.length; i++) {
            this.anchor[i].setHighlight(b);
        }
    },
    draw : function(p5) {
        if (this.getActiveCount() == 0) {
            return;
        }
        p5.strokeWeight(.005);
        var color = (this.select ? SunGear.C_SELECT : (this.highlight ? SunGear.C_HIGHLIGHT : SunGear.C_PLAIN));
        p5.fill(color);
        if (this.getSelectedCount() == 0 && color == SunGear.C_PLAIN) {
            p5.fill('#D1CDB8');
        }
        p5.ellipse(this.shape.x,this.shape.y,this.shape.h,this.shape.w);
        if (this.getSelectedCount() > 0) {
            // FIXME: g2.fill(selectedShape)
        }
        if (this.showArrows) {
            for (var i = 0; i < this.angle.length; i++) {
                this.drawArrow(p5, this.angle[i]);
            }
        }
    },
    drawArrow : function(p5, theta) {
        p5.push();
        p5.translate(this.center.x, this.center.y);
        p5.scale(this.radOuter, this.radOuter);
        p5.rotate(theta);
        var w = 0.05 * this.radMax / this.radOuter;
        p5.strokeWeight(w);
        p5.line(1.0, 0, 1.0 + VesselDisplay.ARROW_LINE, 0);
        p5.line(1.0 + VesselDisplay.ARROW_LINE, 0, 1.0 + VesselDisplay.ARROW_LINE - VesselDisplay.ARROW_END, VesselDisplay.ARROW_END);
        p5.line(1.0 + VesselDisplay.ARROW_LINE, 0, 1.0 + VesselDisplay.ARROW_LINE - VesselDisplay.ARROW_END, -(VesselDisplay.ARROW_END));
        p5.pop();
    }
};

module.exports = VesselDisplay;