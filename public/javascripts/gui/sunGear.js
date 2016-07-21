var Comp = require('./sungear/comp');

/**
 * Interactive generalization of a Venn diagram to many dimensions.
 */
function SunGear(genes, thresh, statsF) {
    if (typeof statsF === 'undefined') {
        statsF = thresh;
        thresh = 0.0;
    }
    this.minRad = [ 0.0, 0.005, 0.010, 0.015, 0.020 ];

    this.genes = genes;
    this.thresh = thresh;
    this.statsF = statsF;
    this.moon = null;
    this.orderedVessels = [];
    this.vSort = new Comp.VesselSelSize();
    this.polarPlot = false;
    this.showArrows = true;
    this.minRadIdx = 0;
    
    // TODO: @Dennis Use p5 to add Sungear GUI components from lines 141 - 192
    
    this.setShowArrows(this.showArrows);

    this.highCnt = 0;
    this.lastAnchor = null;
    this.lastVessel = null;
    
    // TODO: @Dennis use p5 for lines 196 - 255
    
    this.setFocusable(true);
    this.genes.addGeneListener(this);
    this.genes.addMultiSelect(this);
    this.anchors = [];
    this.vessels = [];
    this.goTerm = null;
    this.multi = false;
    this.relax = true;
}

SunGear.R_OUTER = 1.2;
SunGear.R_CIRCLE = 1.0;
SunGear.C_PLAIN = "#F3FE0F";
SunGear.C_HIGHLIGHT = "#9A3334";
SunGear.C_SELECT = "#217C7E";

SunGear.prototype = {
    constructor : SunGear,
    cleanup : function() {
        var i = 0;
        for (i = 0; i < this.anchors.length; i++) {
            this.anchors[i].cleanup();
        }
        this.anchors = null;
        for (i = 0; i < this.vessels.length; i++) {
            this.vessels[i].cleanup();
        }
        this.vessels = null;
        this.genes = null;
        this.lastAnchor = null;
        this.lastVessel = null;
    },
    getVessels : function() {
        return this.vessels;
    },
    makeButton : function(main, rollover, pressed) {
        // Likely unnecessary
    },
    order : function(n) {
        if (n != -1) {
            try {
                var v = this.orderedVessels[n];
                this.lastVessel = v;
                this.highlightVessel(v);
                this.updateCount();
                // repaint?
            } catch (e) {
                console.log(e);
            }
        }
    },
    set : function(src) {
        // make the displayable components
        var t = this.thresh;
        console.log("thresh: " + this.thresh);
        if(isNaN(t)) {
            console.log("check");
            t = 1.0;
            try {
                t = src.getAttributes().get("threshold");
            } catch(e) {
                console.log("Oops! From Sungear.set");
            }
        }
        console.log("t: " + t);
        var v = [];
        // FIXME
        var tempReader = new DataReader();
        tempReader.setThreshold(t, this.genes.getGenesSet(), this.src.getReader().anchors, v);
        // FIXME
        this.makeDisplay(this.src.getReader().anchors, v);
        console.log("Anchors: " + this.anchors.length + " vessels: " + this.vessels.length);
    },
    setGo : function(t) {
        this.goTerm = t;
    },
    setRelax : function(b) {
        this.relax = b;
        this.positionVessels();
    },
    getRelax : function() {
        return this.relax;
    },
    setMinVesselSizeIdx : function(n) {
        // TODO: Find out if this is necessary
    },
    setShowArrows : function(b) {
        // TODO: Find out if this is necessary
    },
    showStats : function() {
        // TODO: Make sure this works.
        var val = (this.statsF.title == 'true');
        this.statsF.title = !val;
    },
    getGeneTerms : function(g) {
        if (this.goTerm === null || this.goTerm.get() === null) {
            return [];
        } else {
            return this.goTerm.get().getCurrentTerms(g);
        }
    },
    getAssocGenes : function() {
        return (this.goTerm === null || this.goTerm.get() === null) ? new TreeSet() : this.goTerm.get().assocGenes;
    },
    getTerms : function(c) {
        var t = new TreeSet();
        for (var it = 0; it < c.length; it++) {
            t.addAll(this.getGeneTerms(c[it]));
        }
        return t;
    },
    getCool : function(maxVessels, minScore, method) {
        console.log("method: " + method);
        var cool = new TreeSet();
        var debug = true; // TODO: Change this in production
        var ag = this.getAssocGenes();
        for (var i = 0; i < this.vessels.length; i++) {
            if (this.vessels[i].getActiveCount() == 0) {
                continue;
            }
            if (debug) {
                console.log("sz: " + this.vessels[i].activeGenes.size());
            }
            var tt = this.getTerms(this.vessels[i].activeGenes);
            var ct = [];
            for (var it = tt.iterator(); it.hasNext(); ) {

            }
        }
    }
};

module.exports = SunGear;